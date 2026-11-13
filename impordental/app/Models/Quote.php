<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    public const ESTADOS = [
        'pendiente' => 'Pendiente',
        'en_proceso' => 'En proceso',
        'respondida' => 'Respondida',
        'cerrada' => 'Cerrada',
    ];

    protected $fillable = ['user_id', 'status', 'notes', 'response', 'responded_at'];

    protected function casts(): array
    {
        return [
            'responded_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(QuoteItem::class);
    }

    public function getStatusLabelAttribute(): string
    {
        return self::ESTADOS[$this->status] ?? ucfirst($this->status);
    }

    /** Número visible para el cliente, p. ej. COT-00012. */
    public function getNumberAttribute(): string
    {
        return 'COT-'.str_pad((string) $this->id, 5, '0', STR_PAD_LEFT);
    }
}
