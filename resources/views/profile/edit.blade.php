@extends('layouts.asana')

@section('content')
<div class="py-12 px-4 md:px-8 max-w-3xl mx-auto space-y-8">
    <div class="mb-4 border-b border-gray-200 dark:border-white/5 pb-8">
        <h1 class="text-3xl font-light text-gray-900 dark:text-white tracking-wide mb-1">Mi Perfil</h1>
        <p class="text-gray-500 text-xs font-medium tracking-[0.15em] uppercase">Administra tu foto, datos de cuenta y contraseña</p>
    </div>

    @php
        $photoUrl = $user->photo
            ? asset('storage/' . $user->photo)
            : ($user->teamMember && $user->teamMember->photo ? asset('storage/' . $user->teamMember->photo) : null);
    @endphp

    <!-- Foto de Perfil -->
    <div class="bg-white dark:bg-white/[0.03] backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm dark:shadow-2xl">
        <h2 class="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Foto de Perfil</h2>
        <form action="{{ route('profile.photo.update') }}" method="POST" enctype="multipart/form-data" class="flex flex-col sm:flex-row items-center gap-6">
            @csrf
            <div class="w-24 h-24 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 text-2xl font-bold overflow-hidden shrink-0">
                @if($photoUrl)
                    <img src="{{ $photoUrl }}" alt="{{ $user->name }}" class="w-full h-full object-cover">
                @else
                    {{ strtoupper(substr($user->name, 0, 1)) }}
                @endif
            </div>
            <div class="flex-1 w-full space-y-3">
                <input type="file" name="photo" accept="image/*" required
                       class="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-orange-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-orange-900/20 dark:file:text-orange-400">
                @error('photo') <p class="text-red-500 text-xs">{{ $message }}</p> @enderror
                <button type="submit" class="bg-orange-600 text-white font-bold text-xs uppercase tracking-[0.2em] px-6 py-3 rounded-2xl hover:bg-orange-700 transition-all">
                    Subir Foto
                </button>
                @if(session('status') === 'photo-updated')
                    <span class="text-xs text-green-500 font-bold uppercase tracking-widest ml-2">Guardada</span>
                @endif
            </div>
        </form>
    </div>

    <!-- Galería de Fotos -->
    <div class="bg-white dark:bg-white/[0.03] backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm dark:shadow-2xl">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-sm font-bold text-gray-500 uppercase tracking-widest">Galería de Fotos</h2>
            <span class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{{ $user->photos->count() }}/3</span>
        </div>

        @if(session('error'))
            <p class="text-red-500 text-xs mb-4">{{ session('error') }}</p>
        @endif

        <div class="grid grid-cols-3 gap-4 mb-6">
            @foreach($user->photos as $galleryPhoto)
                <div class="relative group aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10">
                    <img src="{{ asset('storage/' . $galleryPhoto->path) }}" class="w-full h-full object-cover">
                    <form action="{{ route('profile.gallery.destroy', $galleryPhoto) }}" method="POST" class="absolute top-2 right-2" onsubmit="return confirm('¿Eliminar esta foto?');">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80">
                            <i class="fas fa-times text-xs"></i>
                        </button>
                    </form>
                </div>
            @endforeach
            @for($i = $user->photos->count(); $i < 3; $i++)
                <div class="aspect-square rounded-2xl border border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center text-gray-400 dark:text-gray-600">
                    <i class="fas fa-image text-xl"></i>
                </div>
            @endfor
        </div>

        @if($user->photos->count() < 3)
            <form action="{{ route('profile.gallery.store') }}" method="POST" enctype="multipart/form-data" class="flex flex-col sm:flex-row items-center gap-3">
                @csrf
                <input type="file" name="photo" accept="image/*" required
                       class="flex-1 w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-orange-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-orange-900/20 dark:file:text-orange-400">
                <button type="submit" class="bg-orange-600 text-white font-bold text-xs uppercase tracking-[0.2em] px-6 py-3 rounded-2xl hover:bg-orange-700 transition-all whitespace-nowrap">
                    Agregar Foto
                </button>
            </form>
            @error('photo') <p class="text-red-500 text-xs mt-2">{{ $message }}</p> @enderror
        @endif
    </div>

    <!-- Datos de la cuenta -->
    <div class="bg-white dark:bg-white/[0.03] backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm dark:shadow-2xl">
        <h2 class="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Datos de la Cuenta</h2>
        <form method="POST" action="{{ route('profile.update') }}" class="space-y-6">
            @csrf
            @method('patch')

            <div class="space-y-2">
                <label for="name" class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nombre</label>
                <input type="text" name="name" id="name" value="{{ old('name', $user->name) }}" required
                       class="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-orange-500 outline-none">
                @error('name') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
            </div>

            <div class="space-y-2">
                <label for="email" class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Correo</label>
                <input type="email" name="email" id="email" value="{{ old('email', $user->email) }}" required
                       class="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-orange-500 outline-none">
                @error('email') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
            </div>

            <div class="flex items-center gap-4">
                <button type="submit" class="bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-[0.2em] px-6 py-3 rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all">
                    Guardar
                </button>
                @if(session('status') === 'profile-updated')
                    <span class="text-xs text-green-500 font-bold uppercase tracking-widest">Guardado</span>
                @endif
            </div>
        </form>
    </div>

    <!-- Cambiar contraseña -->
    <div class="bg-white dark:bg-white/[0.03] backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm dark:shadow-2xl">
        <h2 class="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Cambiar Contraseña</h2>
        <form method="POST" action="{{ route('password.update') }}" class="space-y-6">
            @csrf
            @method('put')

            <div class="space-y-2">
                <label for="current_password" class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contraseña Actual</label>
                <input type="password" name="current_password" id="current_password" autocomplete="current-password"
                       class="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-orange-500 outline-none">
                @error('current_password', 'updatePassword') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
            </div>

            <div class="space-y-2">
                <label for="password" class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nueva Contraseña</label>
                <input type="password" name="password" id="password" autocomplete="new-password"
                       class="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-orange-500 outline-none">
                @error('password', 'updatePassword') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
            </div>

            <div class="space-y-2">
                <label for="password_confirmation" class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Confirmar Contraseña</label>
                <input type="password" name="password_confirmation" id="password_confirmation" autocomplete="new-password"
                       class="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-orange-500 outline-none">
                @error('password_confirmation', 'updatePassword') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
            </div>

            <div class="flex items-center gap-4">
                <button type="submit" class="bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-[0.2em] px-6 py-3 rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all">
                    Actualizar Contraseña
                </button>
                @if(session('status') === 'password-updated')
                    <span class="text-xs text-green-500 font-bold uppercase tracking-widest">Guardado</span>
                @endif
            </div>
        </form>
    </div>
</div>
@endsection
