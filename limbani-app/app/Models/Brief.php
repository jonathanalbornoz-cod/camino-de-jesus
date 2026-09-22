<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Brief extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'project_id',
        'answers',
        'objectives',
        'target_audience',
        'key_dates',
        'budget',
        'special_requirements',
        'key_messages',
        'success_metrics',
        'competitor_analysis',
        'brand_guidelines',
        'content_preferences',
        'status',
        'submitted_at',
        'reviewed_at',
        'approved_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'answers' => 'array',
        'budget' => 'decimal:2',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'approved_at' => 'datetime',
    ];

    /**
     * Ensure answers is always an array.
     */
    public function getAnswersAttribute($value)
    {
        $decoded = json_decode($value, true);
        if (is_array($decoded)) {
            return $decoded;
        }
        
        // Default structure if null or invalid
        return array_fill_keys(array_map(fn($i) => "q$i", range(1, 20)), '');
    }

    /**
     * Get the project that owns the brief.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * The question sections used to render the brief (edit, show and PDF views).
     */
    public static function sections(): array
    {
        return [
            ['title' => 'Prioridades del Mes', 'icon' => 'fas fa-bullseye', 'color' => 'orange', 'qs' => [
                'q1' => 'Lanzamientos, promociones o novedades',
                'q2' => 'Producto/Servicio con mayor visibilidad',
                'q3' => 'Objetivo comercial principal',
            ]],
            ['title' => 'Mensaje Estratégico', 'icon' => 'fas fa-comment-dots', 'color' => 'blue', 'qs' => [
                'q4' => 'Mensaje principal a comunicar',
                'q5' => 'Campañas internas o anuncios',
            ]],
            ['title' => 'Productos a Destacar', 'icon' => 'fas fa-gem', 'color' => 'purple', 'qs' => [
                'q6' => 'Productos/servicios a promocionar',
                'q7' => 'Prioridad máxima de venta',
                'q8' => 'Promociones o descuentos',
            ]],
            ['title' => 'Fechas y Oportunidades', 'icon' => 'fas fa-calendar-star', 'color' => 'yellow', 'qs' => [
                'q9' => 'Fechas especiales o eventos',
                'q10' => 'Casos de éxito o experiencias',
            ]],
            ['title' => 'Contenido Estratégico', 'icon' => 'fas fa-paint-brush', 'color' => 'indigo', 'qs' => [
                'q11' => 'Tipo de contenido priorizado',
                'q12' => 'Preguntas frecuentes a responder',
                'q13' => 'Temas a EVITAR',
            ]],
            ['title' => 'Recursos Disponibles', 'icon' => 'fas fa-camera', 'color' => 'green', 'qs' => [
                'q14' => 'Material gráfico/video disponible',
                'q15' => 'Personas que pueden participar',
            ]],
            ['title' => 'Publicidad (Meta Ads)', 'icon' => 'fas fa-rocket', 'color' => 'red', 'qs' => [
                'q16' => '¿Realizar pauta publicitaria?',
                'q17' => 'Presupuesto total de pauta',
                'q18' => 'Distribución del presupuesto',
            ]],
            ['title' => 'Resultados Esperados', 'icon' => 'fas fa-trophy', 'color' => 'amber', 'qs' => [
                'q19' => 'Resultado ideal tras la estrategia',
            ]],
            ['title' => 'Información Adicional', 'icon' => 'fas fa-info-circle', 'color' => 'gray', 'qs' => [
                'q20' => 'Observaciones finales',
            ]],
        ];
    }

    /**
     * Human-readable labels for each brief status.
     */
    public static function statusLabels(): array
    {
        return [
            'draft' => 'Borrador',
            'submitted' => 'Enviado',
            'reviewed' => 'Revisado',
            'approved' => 'Aprobado',
        ];
    }

    /**
     * Check if brief is in draft status.
     */
    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    /**
     * Check if brief is submitted.
     */
    public function isSubmitted(): bool
    {
        return $this->status === 'submitted';
    }

    /**
     * Check if brief is reviewed.
     */
    public function isReviewed(): bool
    {
        return $this->status === 'reviewed';
    }

    /**
     * Check if brief is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Mark brief as submitted.
     */
    public function markAsSubmitted(): void
    {
        $this->update([
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);
    }

    /**
     * Mark brief as reviewed.
     */
    public function markAsReviewed(): void
    {
        $this->update([
            'status' => 'reviewed',
            'reviewed_at' => now(),
        ]);
    }

    /**
     * Mark brief as approved.
     */
    public function markAsApproved(): void
    {
        $this->update([
            'status' => 'approved',
            'approved_at' => now(),
        ]);
    }
}