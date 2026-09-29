<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'hierarchy_level',
    ];

    // Constantes para Roles
    const ROLE_ADMIN = 'admin';
    const ROLE_CEO = 'ceo';
    const ROLE_COLABORADOR = 'colaborador';
    const ROLE_RRHH = 'rrhh';
    const ROLE_CONTABILIDAD = 'contabilidad';

    /**
     * Verificar si el usuario tiene un rol específico.
     */
    public function hasRole($role): bool
    {
        return $this->role === $role;
    }

    /**
     * Verificar si el usuario es administrador.
     */
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function teamMember()
    {
        return $this->hasOne(TeamMember::class);
    }

    public function invitedProjects()
    {
        return $this->belongsToMany(Project::class);
    }

    /**
     * ¿Puede este usuario asignar tareas al usuario dado, según su cargo jerárquico?
     * Un nivel más alto (número mayor) significa menor rango.
     */
    public function canAssignTo(?User $other): bool
    {
        if (!$other) {
            return false;
        }

        if (in_array($this->role, ['admin', 'ceo', 'rrhh', 'contabilidad'])) {
            return true;
        }

        return $this->hierarchy_level !== null
            && $other->hierarchy_level !== null
            && $other->hierarchy_level > $this->hierarchy_level;
    }
}
