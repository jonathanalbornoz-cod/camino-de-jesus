<?php

namespace App\Http\Controllers;

use App\Models\Subtask;
use App\Models\Task;
use Illuminate\Http\Request;
use App\Notifications\TaskAssigned;
use App\Notifications\TaskCompleted;
use App\Notifications\MentionNotification;
use App\Notifications\NewCommentNotification;
use App\Models\User;
use App\Services\MentionService;

class SubtaskController extends Controller
{
    // Guardar nueva subtarea
    public function store(Request $request, Task $task)
    {
        $request->validate(['title' => 'required|string|max:255']);

        $task->subtasks()->create([
            'title' => $request->title,
            'due_date' => null,
            'is_completed' => false,
            'position' => $task->subtasks()->count(),
        ]);

        return back()->with('success', 'Acción agregada correctamente.');
    }

    // Modificar subtarea existente
    public function update(Request $request, Subtask $subtask)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'team_member_id' => 'nullable',
            'due_date' => 'nullable',
            'start_date' => 'nullable',
            'description' => 'nullable|string',
            'is_completed' => 'nullable',
            'is_approved' => 'nullable'
        ]);

        $data = $request->only(['title', 'description', 'due_date', 'start_date', 'team_member_id']);

        $oldDescription = $subtask->description;
        $wasCompleted = $subtask->is_completed;
        if ($request->has('is_completed')) {
            $data['is_completed'] = filter_var($request->is_completed, FILTER_VALIDATE_BOOLEAN);
        }

        // Puede aprobar un rol de gestión, o quien asignó la tarea.
        $canApprove = in_array(auth()->user()->role, ['admin', 'ceo', 'rrhh', 'contabilidad'])
            || ($subtask->assigned_by && (int) $subtask->assigned_by === auth()->id());
        if ($request->has('is_approved') && $canApprove) {
            $data['is_approved'] = filter_var($request->is_approved, FILTER_VALIDATE_BOOLEAN);
            if ($data['is_approved'] && !$subtask->is_approved) {
                $data['approved_at'] = now();
                $data['approved_by'] = auth()->id();
            }
        }

        if ($request->has('team_member_id')) {
            $newTeamMemberId = empty($request->team_member_id) ? null : $request->team_member_id;

            // Un colaborador solo puede asignar tareas a colaboradores de menor cargo jerárquico.
            if ($newTeamMemberId && auth()->user()->role === 'colaborador') {
                $targetMember = \App\Models\TeamMember::with('user')->find($newTeamMemberId);
                if (!auth()->user()->canAssignTo($targetMember?->user)) {
                    abort(403, 'No tienes permiso para asignar tareas a este colaborador.');
                }
            }

            $data['team_member_id'] = $newTeamMemberId;
            if ($newTeamMemberId) {
                $data['assigned_by'] = auth()->id();
            }
        }

        $oldMemberId = $subtask->team_member_id;
        $subtask->update($data);

        // Notificar si hay un nuevo responsable asignado: al responsable y, además, a todos los
        // demás usuarios del sistema (quien realiza la acción no se notifica a sí mismo).
        if (isset($data['team_member_id']) && $data['team_member_id'] != $oldMemberId) {
            $member = \App\Models\TeamMember::find($data['team_member_id']);
            $alreadyNotified = [auth()->id()];

            if ($member && $member->user) {
                $member->user->notify(new TaskAssigned($subtask, auth()->user()));
                $alreadyNotified[] = $member->user_id;
            }

            \Illuminate\Support\Facades\Notification::send(
                User::whereNotIn('id', $alreadyNotified)->get(),
                new TaskAssigned($subtask, auth()->user())
            );
        }

        // Notificar cuando se marca como finalizada: a quien asignó la tarea y a todos los
        // demás usuarios del sistema (quien realiza la acción no se notifica a sí mismo).
        if (($data['is_completed'] ?? false) && !$wasCompleted) {
            $alreadyNotified = [auth()->id()];

            if ($subtask->assigned_by && (int) $subtask->assigned_by !== auth()->id()) {
                $assigner = User::find($subtask->assigned_by);
                if ($assigner) {
                    $assigner->notify(new TaskCompleted($subtask, auth()->user()));
                    $alreadyNotified[] = $assigner->id;
                }
            }

            \Illuminate\Support\Facades\Notification::send(
                User::whereNotIn('id', $alreadyNotified)->get(),
                new TaskCompleted($subtask, auth()->user())
            );
        }

        // Notificar a quien fue mencionado con "@Nombre" en la descripción (solo menciones nuevas).
        if (array_key_exists('description', $data) && $data['description'] !== $oldDescription) {
            $oldMentionIds = MentionService::extractMentionedUsers($oldDescription)->pluck('id');
            foreach (MentionService::extractMentionedUsers($data['description']) as $mentionedUser) {
                if ($mentionedUser->id !== auth()->id() && !$oldMentionIds->contains($mentionedUser->id)) {
                    $mentionedUser->notify(new MentionNotification($subtask, auth()->user(), 'descripción'));
                }
            }
        }

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Guardado correctamente',
                'subtask' => $subtask->load(['children', 'teamMember', 'attachments', 'comments.user', 'task.project', 'parent'])
            ]);
        }

        return back()->with('success', 'Acción actualizada.');
    }

    // Eliminar subtarea
    public function destroy(Request $request, Subtask $subtask)
    {
        \Log::info("Eliminando Subtask ID: " . $subtask->id);
        $subtask->delete();

        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return back()->with('success', 'Acción eliminada.');
    }

    // Duplicar subtarea (y todo lo que tenga anidado adentro)
    public function duplicate(Subtask $subtask)
    {
        $this->cloneSubtaskRecursive($subtask, $subtask->task_id, $subtask->parent_id, true);

        return back()->with('success', 'Acción duplicada.');
    }

    private function cloneSubtaskRecursive(Subtask $subtask, $taskId, $parentId, $isRoot = false)
    {
        $newSubtask = $subtask->replicate();
        $newSubtask->task_id = $taskId;
        $newSubtask->parent_id = $parentId;
        if ($isRoot) {
            $newSubtask->title = $subtask->title . ' (Copia)';
        }
        $newSubtask->position = $subtask->position + 1;
        $newSubtask->save();

        foreach ($subtask->children as $child) {
            $this->cloneSubtaskRecursive($child, $taskId, $newSubtask->id);
        }

        return $newSubtask;
    }

    // Guardar subtarea HIJA (dentro de otra subtarea)
    public function storeChild(Request $request, Subtask $subtask)
    {
        $request->validate(['title' => 'required|string|max:255']);

        $child = $subtask->children()->create([
            'title' => $request->title,
            'task_id' => $subtask->task_id, // Hereda la tarea principal
            'due_date' => null,
            'is_completed' => false,
            'position' => $subtask->children()->count(),
        ]);

        if ($request->wantsJson()) {
            return response()->json($child);
        }
        return back()->with('success', 'Subtarea agregada.');
    }
    // Reordenar subtareas
    public function reorder(Request $request)
    {
        $request->validate([
            'order' => 'required|array',
            'order.*' => 'exists:subtasks,id'
        ]);

        foreach ($request->order as $index => $id) {
            Subtask::where('id', $id)->update(['position' => $index]);
        }

        return response()->json(['success' => true]);
    }
}