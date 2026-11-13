@extends('layouts.tienda')

@section('title', 'Ingresar · ImporDental')

@section('content')
<section class="auth">
    <div class="wrap auth__grid">
        <div class="auth__aside">
            <span class="kicker"><i></i> Portal de clientes</span>
            <h1>Bienvenido <span class="grad">de nuevo.</span></h1>
            <p>Ingresa para enviar tu cotización y ver la respuesta de nuestros asesores.</p>
            <ul class="auth__perks">
                <li>Historial de todas tus cotizaciones</li>
                <li>Respuestas con precios y disponibilidad</li>
                <li>Tus datos listos para cada pedido</li>
            </ul>
        </div>

        <form method="POST" action="{{ route('login') }}" class="form glass auth__card">
            @csrf
            <h2>Ingresar</h2>
            <label class="field">
                <span>Correo electrónico</span>
                <input type="email" name="email" value="{{ old('email') }}" required autofocus autocomplete="email">
                @error('email')<small class="field__error">{{ $message }}</small>@enderror
            </label>
            <label class="field">
                <span>Contraseña</span>
                <input type="password" name="password" required autocomplete="current-password">
            </label>
            <label class="check">
                <input type="checkbox" name="remember" value="1">
                <span>Mantener la sesión iniciada</span>
            </label>
            <button type="submit" class="btn btn--primary btn--block">Ingresar</button>
            <p class="auth__alt">¿No tienes cuenta? <a href="{{ route('registro') }}">Créala aquí</a></p>
        </form>
    </div>
</section>
@endsection
