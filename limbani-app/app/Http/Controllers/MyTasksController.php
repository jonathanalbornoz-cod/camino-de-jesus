<?php

namespace App\Http\Controllers;

use App\Models\Subtask;
use App\Models\TeamMember;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MyTasksController extends Controller
{
    // "Mis Tareas": todas las subtareas asignadas al usuario actual, en Lista, Tablero y Calendario.
    public function index(Request $request)
    {
        $user = Auth::user();
        $teamMemberId = $user->teamMember ? $user->teamMember->id : null;

        return $this->renderSchedule($request, $teamMemberId, null);
    }

    // Ver el cronograma (Lista, Tablero y Calendario) de OTRO colaborador, sin tener que
    // iniciar sesión con su cuenta. Solo para quien puede asignarle tareas (o administración).
    public function show(Request $request, TeamMember $member)
    {
        $viewer = Auth::user();
        $canView = in_array($viewer->role, ['admin', 'ceo', 'rrhh', 'contabilidad'])
            || ($member->user_id && $viewer->canAssignTo($member->user));

        abort_unless($canView, 403, 'No tienes permiso para ver el cronograma de este colaborador.');

        return $this->renderSchedule($request, $member->id, $member);
    }

    private function renderSchedule(Request $request, ?int $teamMemberId, ?TeamMember $viewingMember)
    {
        $tasks = $teamMemberId
            ? Subtask::where('team_member_id', $teamMemberId)->with(['task.project', 'parent'])->get()
            : collect();

        $pending = $tasks->where('is_completed', false);

        $overdue = $pending->filter(fn($t) => $t->due_date && $t->due_date->isPast())->sortBy('due_date')->values();
        $withDate = $pending->filter(fn($t) => $t->due_date && !$t->due_date->isPast())->sortBy('due_date')->values();
        $noDate = $pending->filter(fn($t) => !$t->due_date)->values();
        $completed = $tasks->where('is_completed', true)->sortByDesc('due_date')->values();

        $view = $request->query('view', 'list');

        $month = Carbon::parse($request->query('month') ? $request->query('month') . '-01' : now()->startOfMonth());
        $calendarStart = $month->copy()->startOfMonth()->startOfWeek(Carbon::MONDAY);
        $calendarEnd = $month->copy()->endOfMonth()->endOfWeek(Carbon::SUNDAY);

        $calendarWeeks = [];
        $cursor = $calendarStart->copy();
        while ($cursor->lte($calendarEnd)) {
            $week = [];
            for ($i = 0; $i < 7; $i++) {
                $week[] = $cursor->copy();
                $cursor->addDay();
            }
            $calendarWeeks[] = $week;
        }

        $tasksByDate = $tasks->whereNotNull('due_date')->groupBy(fn($t) => $t->due_date->format('Y-m-d'));
        $noDateCount = $noDate->count();

        return view('my_tasks.index', compact(
            'overdue', 'withDate', 'noDate', 'completed',
            'view', 'month', 'calendarWeeks', 'tasksByDate', 'noDateCount', 'viewingMember'
        ));
    }
}
