<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AttendanceController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\SubtaskController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\TeamMemberController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\UserController;


Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', [ProjectController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    // 0. Sistema de Asistencia QR
    Route::get('/attendance/scanner', [AttendanceController::class, 'scanner'])->name('attendance.scanner');
    Route::post('/attendance/scan', [AttendanceController::class, 'scan'])->name('attendance.scan');
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');

    // 1. Perfil de Usuario
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.photo.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // 2. Rutas de la Agencia (Proyectos)
    // Crear, editar y borrar proyectos: solo administradores.
    Route::middleware([\App\Http\Middleware\CheckRole::class.':admin'])->group(function () {
        Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
        Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
        Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
        Route::put('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');
        Route::post('/projects/{project}/duplicate', [ProjectController::class, 'duplicate'])->name('projects.duplicate');
    });
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::post('/projects/reorder', [ProjectController::class, 'reorder'])->name('projects.reorder');
    // Invitar colaboradores al proyecto: administración y mandos de gestión.
    Route::middleware([\App\Http\Middleware\CheckRole::class.':admin,ceo,rrhh,contabilidad'])->group(function () {
        Route::post('/projects/{project}/invite', [ProjectController::class, 'invite'])->name('projects.invite');
        Route::delete('/projects/{project}/members/{user}', [ProjectController::class, 'removeMember'])->name('projects.members.remove');
    });
    Route::post('/projects/{project}/generate-meta-strategy', [ProjectController::class, 'generateMetaStrategy'])->name('projects.generate-meta-strategy');

    // 3. Rutas de Tareas
    Route::post('/projects/{project}/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::put('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
    Route::post('/tasks/{task}/duplicate', [TaskController::class, 'duplicate'])->name('tasks.duplicate');
    Route::post('/tasks/{task}/move', [TaskController::class, 'move'])->name('tasks.move');

    // 4. Rutas de Subtareas
    Route::post('/tasks/{task}/subtasks', [SubtaskController::class, 'store'])->name('subtasks.store');
    Route::put('/subtasks/{subtask}', [SubtaskController::class, 'update'])->name('subtasks.update');
    Route::delete('/subtasks/{subtask}', [SubtaskController::class, 'destroy'])->name('subtasks.destroy');
    Route::post('/subtasks/{subtask}/duplicate', [SubtaskController::class, 'duplicate'])->name('subtasks.duplicate');
    Route::post('/subtasks/{subtask}/subtasks', [SubtaskController::class, 'storeChild'])->name('subtasks.children.store');
    Route::post('/subtasks/reorder', [SubtaskController::class, 'reorder'])->name('subtasks.reorder');

    Route::post('/subtasks/{subtask}/comments', [CommentController::class, 'store'])->name('subtasks.comments.store');
    Route::get('/subtasks-detail/{subtask}', function(\App\Models\Subtask $subtask) {
        return $subtask->load(['children', 'teamMember', 'attachments', 'comments.user', 'task', 'parent', 'task.project']);
    });
    
    // Archivos Adjuntos
    Route::post('/subtasks/{subtask}/attachments', [AttachmentController::class, 'store'])->name('subtasks.attachments.store');
    Route::delete('/attachments/{attachment}', [AttachmentController::class, 'destroy'])->name('subtasks.attachments.destroy');

    // 5. Rutas de Equipo (Protegidas)
    Route::get('/team', [TeamMemberController::class, 'index'])->name('team.index');
    
    Route::middleware([\App\Http\Middleware\CheckRole::class.':admin,ceo,rrhh,contabilidad'])->group(function () {
        Route::post('/team', [TeamMemberController::class, 'store'])->name('team.store');
        Route::get('/team/{teamMember}', [TeamMemberController::class, 'show'])->name('team.show');
        Route::get('/team/{teamMember}/edit', [TeamMemberController::class, 'edit'])->name('team.edit');
        Route::put('/team/{teamMember}', [TeamMemberController::class, 'update'])->name('team.update');
        Route::delete('/team/{teamMember}', [TeamMemberController::class, 'destroy'])->name('team.destroy');
        
        Route::patch('/billing/{billing}/status', [\App\Http\Controllers\BillingController::class, 'updateStatus'])->name('billing.status');
    });

    // Rutas de Briefs (Formularios dinámicos para clientes)
    Route::get('/projects/{project}/brief', [\App\Http\Controllers\BriefController::class, 'edit'])->name('briefs.edit');
    Route::put('/projects/{project}/brief', [\App\Http\Controllers\BriefController::class, 'update'])->name('briefs.update');
    Route::get('/projects/{project}/brief/show', [\App\Http\Controllers\BriefController::class, 'show'])->name('briefs.show');
    Route::get('/projects/{project}/brief/download', [\App\Http\Controllers\BriefController::class, 'download'])->name('briefs.download');
    Route::get('/projects/{project}/brief/status', [\App\Http\Controllers\BriefController::class, 'status'])->name('briefs.status');
    Route::post('/projects/{project}/brief/ai-suggestions', [\App\Http\Controllers\BriefAIController::class, 'getSuggestions'])->name('briefs.ai-suggestions');

    // Rutas de Cuentas de Cobro
    Route::get('/billing', [\App\Http\Controllers\BillingController::class, 'index'])->name('billing.index');
    Route::post('/billing', [\App\Http\Controllers\BillingController::class, 'store'])->name('billing.store');
    Route::delete('/billing/{billing}', [\App\Http\Controllers\BillingController::class, 'destroy'])->name('billing.destroy');

    // 7. Gestión Administrativa & Contratos
    Route::get('/admin-projects', [\App\Http\Controllers\AdministrativeProjectController::class, 'index'])->name('admin-projects.index');
    Route::post('/admin-projects', [\App\Http\Controllers\AdministrativeProjectController::class, 'store'])->middleware([\App\Http\Middleware\CheckRole::class.':admin'])->name('admin-projects.store');
    Route::post('/contracts', [\App\Http\Controllers\ContractController::class, 'store'])->name('contracts.store');
    Route::get('/contracts/{contract}/print', [\App\Http\Controllers\ContractController::class, 'print'])->name('contracts.print');

    // 8. Gestion de Usuarios (Admin/CEO)
    Route::resource('users', UserController::class)->except(['show', 'edit', 'update']);



    // Notificaciones
    Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
});

require __DIR__.'/auth.php';
