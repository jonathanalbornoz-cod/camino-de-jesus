<?php

namespace App\Http\Controllers;

use App\Models\Brief;
use Illuminate\Http\Request;

class PublicBriefController extends Controller
{
    // Formulario público (sin iniciar sesión) para que el cliente llene su brief mensual.
    public function edit(string $token)
    {
        $brief = Brief::where('public_token', $token)->with('project')->firstOrFail();

        return view('briefs.public', [
            'project' => $brief->project,
            'brief' => $brief,
        ]);
    }

    public function update(Request $request, string $token)
    {
        $brief = Brief::where('public_token', $token)->firstOrFail();

        $validated = $request->validate([
            'answers' => 'nullable|array',
        ]);

        $brief->update($validated);
        $brief->markAsSubmitted();

        return redirect()->route('briefs.public.edit', $token)
            ->with('success', '¡Gracias! Tu brief fue enviado correctamente.');
    }
}
