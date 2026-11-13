@extends('layouts.tienda')

@section('title', 'Crear cuenta · ImporDental')

@section('content')
<section class="auth">
    <div class="wrap auth__grid">
        <div class="auth__aside">
            <span class="kicker"><i></i> Portal de clientes</span>
            <h1>Crea tu cuenta <span class="grad">en un minuto.</span></h1>
            <p>Con tu cuenta puedes enviar cotizaciones, consultar su estado y recibir la respuesta de un asesor especializado.</p>
            <ul class="auth__perks">
                <li>Cotiza cualquier producto del catálogo</li>
                <li>Consulta el estado de tus solicitudes</li>
                <li>Asesoría para clínicas y especialistas</li>
            </ul>
        </div>

        <form method="POST" action="{{ route('registro') }}" class="form glass auth__card">
            @csrf
            <h2>Crear cuenta</h2>
            <label class="field">
                <span>Nombre completo</span>
                <input type="text" name="name" value="{{ old('name') }}" required maxlength="255" autocomplete="name">
                @error('name')<small class="field__error">{{ $message }}</small>@enderror
            </label>
            <label class="field">
                <span>Correo electrónico</span>
                <input type="email" name="email" value="{{ old('email') }}" required maxlength="255" autocomplete="email">
                @error('email')<small class="field__error">{{ $message }}</small>@enderror
            </label>
            <div class="form__row">
                <label class="field">
                    <span>Teléfono</span>
                    <input type="tel" name="phone" value="{{ old('phone') }}" required maxlength="30" autocomplete="tel">
                    @error('phone')<small class="field__error">{{ $message }}</small>@enderror
                </label>
                <label class="field">
                    <span>Ciudad <em>(opcional)</em></span>
                    <input type="text" name="city" value="{{ old('city') }}" maxlength="100" autocomplete="address-level2">
                </label>
            </div>
            <label class="field">
                <span>Clínica o empresa <em>(opcional)</em></span>
                <input type="text" name="company" value="{{ old('company') }}" maxlength="255" autocomplete="organization">
            </label>
            <div class="form__row">
                <label class="field">
                    <span>Contraseña</span>
                    <input type="password" name="password" required minlength="8" autocomplete="new-password">
                    @error('password')<small class="field__error">{{ $message }}</small>@enderror
                </label>
                <label class="field">
                    <span>Repite la contraseña</span>
                    <input type="password" name="password_confirmation" required minlength="8" autocomplete="new-password">
                </label>
            </div>
            <button type="submit" class="btn btn--primary btn--block">Crear mi cuenta</button>
            <p class="auth__alt">¿Ya tienes cuenta? <a href="{{ route('login') }}">Ingresa</a></p>
        </form>
    </div>
</section>
@endsection
