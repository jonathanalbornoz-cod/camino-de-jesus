<?php

namespace App\Http\Controllers\Tienda;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactoController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:3000'],
            // Campo trampa: los bots lo llenan, las personas no lo ven.
            'website' => ['prohibited'],
        ], [], [
            'name' => 'nombre',
            'email' => 'correo',
            'phone' => 'teléfono',
            'subject' => 'asunto',
            'message' => 'mensaje',
        ]);

        ContactMessage::create($data + ['user_id' => $request->user()?->id]);

        return redirect()->to(route('home').'#contacto')
            ->with('contacto_ok', 'Gracias, recibimos tu mensaje. Te contactaremos pronto.');
    }
}
