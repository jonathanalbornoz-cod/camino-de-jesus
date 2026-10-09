<?php

namespace App\Services;

use App\Models\TeamMember;
use Illuminate\Support\Collection;

class MentionService
{
    // Devuelve los usuarios mencionados con "@Nombre Completo" dentro de un texto.
    public static function extractMentionedUsers(?string $text): Collection
    {
        if (!$text || !str_contains($text, '@')) {
            return collect();
        }

        return TeamMember::whereNotNull('user_id')
            ->with('user')
            ->get()
            ->filter(fn($member) => $member->user && str_contains($text, '@' . $member->name))
            ->pluck('user')
            ->unique('id')
            ->values();
    }
}
