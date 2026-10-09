<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MentionNotification extends Notification
{
    use Queueable;

    protected $subtask;
    protected $mentionedBy;
    protected $context;

    public function __construct($subtask, $mentionedBy, string $context = 'comentario')
    {
        $this->subtask = $subtask;
        $this->mentionedBy = $mentionedBy;
        $this->context = $context;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'mention',
            'subtask_id' => $this->subtask->id,
            'title' => $this->subtask->title,
            'project_name' => $this->subtask->task->project->name ?? 'Sin proyecto',
            'mentioned_by_name' => $this->mentionedBy->name,
            'message' => "{$this->mentionedBy->name} te mencionó en un {$this->context} de la tarea: {$this->subtask->title}",
            'link' => route('projects.show', $this->subtask->task->project_id) . "?task_id=" . $this->subtask->id
        ];
    }
}
