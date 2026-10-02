<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskCompleted extends Notification
{
    use Queueable;

    protected $subtask;
    protected $completedBy;

    public function __construct($subtask, $completedBy)
    {
        $this->subtask = $subtask;
        $this->completedBy = $completedBy;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'task_completed',
            'subtask_id' => $this->subtask->id,
            'title' => $this->subtask->title,
            'project_name' => $this->subtask->task->project->name ?? 'Sin proyecto',
            'completed_by_name' => $this->completedBy->name,
            'message' => "{$this->completedBy->name} finalizó la tarea: {$this->subtask->title}. Revísala y apruébala.",
            'link' => route('projects.show', $this->subtask->task->project_id) . "?task_id=" . $this->subtask->id
        ];
    }
}
