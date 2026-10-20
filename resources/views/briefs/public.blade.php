<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Brief Mensual de Programación — {{ $project->name }}</title>
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body { font-family: 'Outfit', sans-serif; }</style>
</head>
<body class="bg-gray-100 text-gray-800 min-h-screen">

    <div class="max-w-3xl mx-auto px-4 py-10 md:py-16">
        <div class="flex items-center gap-3 mb-8">
            <img src="{{ asset('logo.png') }}" alt="Limbani" class="w-10 h-10 rounded-xl shadow-sm">
            <div>
                <p class="text-[11px] font-bold text-orange-500 uppercase tracking-widest">Brief Mensual de Programación</p>
                <h1 class="text-2xl font-extrabold text-gray-900">{{ $project->name }}</h1>
            </div>
        </div>

        @if(session('success'))
            <div class="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl font-medium">
                {{ session('success') }}
            </div>
        @endif

        @if($errors->any())
            <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
                <ul class="list-disc pl-5">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <p class="text-sm text-gray-500 mb-8 leading-relaxed">
            Cuéntanos sobre el mes que viene para tu marca. Entre más detalle nos compartas, mejor podremos planificar el contenido y la estrategia contigo. No necesitas iniciar sesión ni descargar nada: al terminar, haz clic en "Enviar".
        </p>

        <form action="{{ route('briefs.public.update', $brief->public_token) }}" method="POST" class="space-y-6">
            @csrf
            @method('PUT')

            @foreach(\App\Models\Brief::sections() as $section)
                <div class="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                            <i class="{{ $section['icon'] }}"></i>
                        </div>
                        <h2 class="text-lg font-bold text-gray-900">{{ $section['title'] }}</h2>
                    </div>

                    <div class="space-y-6">
                        @foreach($section['qs'] as $key => $label)
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">{{ $label }}</label>

                                @if($key === 'q3')
                                    <select name="answers[q3]" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none">
                                        <option value="">-- Selecciona --</option>
                                        <option value="leads" {{ ($brief->answers['q3'] ?? '') == 'leads' ? 'selected' : '' }}>Generar más clientes potenciales</option>
                                        <option value="ventas" {{ ($brief->answers['q3'] ?? '') == 'ventas' ? 'selected' : '' }}>Aumentar ventas</option>
                                        <option value="branding" {{ ($brief->answers['q3'] ?? '') == 'branding' ? 'selected' : '' }}>Posicionar marca</option>
                                        <option value="lanzamiento" {{ ($brief->answers['q3'] ?? '') == 'lanzamiento' ? 'selected' : '' }}>Lanzar producto</option>
                                        <option value="comunidad" {{ ($brief->answers['q3'] ?? '') == 'comunidad' ? 'selected' : '' }}>Fortalecer comunidad</option>
                                    </select>

                                @elseif($key === 'q11')
                                    @php $selected = (array) ($brief->answers['q11'] ?? []); @endphp
                                    <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        @foreach([
                                            ['id' => 'edu', 'label' => 'Educativo'],
                                            ['id' => 'promo', 'label' => 'Promocional'],
                                            ['id' => 'testi', 'label' => 'Testimonios'],
                                            ['id' => 'bts', 'label' => 'Detrás de Escena'],
                                            ['id' => 'demo', 'label' => 'Demostración'],
                                        ] as $type)
                                            <label class="flex items-center gap-2 p-3 rounded-xl border border-gray-200 text-sm cursor-pointer hover:border-orange-300">
                                                <input type="checkbox" name="answers[q11][]" value="{{ $type['id'] }}" {{ in_array($type['id'], $selected) ? 'checked' : '' }} class="rounded text-orange-500 focus:ring-orange-400">
                                                {{ $type['label'] }}
                                            </label>
                                        @endforeach
                                    </div>

                                @elseif($key === 'q14')
                                    @php $selectedRecursos = (array) ($brief->answers['q14'] ?? []); @endphp
                                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        @foreach(['Fotografías', 'Videos', 'Testimonios', 'Otro'] as $recurso)
                                            <label class="flex items-center gap-2 p-3 rounded-xl border border-gray-200 text-sm cursor-pointer hover:border-orange-300">
                                                <input type="checkbox" name="answers[q14][]" value="{{ $recurso }}" {{ in_array($recurso, $selectedRecursos) ? 'checked' : '' }} class="rounded text-orange-500 focus:ring-orange-400">
                                                {{ $recurso }}
                                            </label>
                                        @endforeach
                                    </div>

                                @elseif($key === 'q16')
                                    <div class="flex gap-3">
                                        <label class="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 text-sm font-bold cursor-pointer has-[:checked]:bg-orange-500 has-[:checked]:border-orange-500 has-[:checked]:text-white">
                                            <input type="radio" name="answers[q16]" value="si" {{ ($brief->answers['q16'] ?? '') == 'si' ? 'checked' : '' }} class="hidden"> SÍ
                                        </label>
                                        <label class="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 text-sm font-bold cursor-pointer has-[:checked]:bg-gray-800 has-[:checked]:border-gray-800 has-[:checked]:text-white">
                                            <input type="radio" name="answers[q16]" value="no" {{ ($brief->answers['q16'] ?? '') == 'no' ? 'checked' : '' }} class="hidden"> NO
                                        </label>
                                    </div>

                                @elseif($key === 'q17')
                                    <input type="number" step="0.01" name="answers[q17]" value="{{ old('answers.q17', $brief->answers['q17'] ?? '') }}" placeholder="0.00" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none">

                                @else
                                    <textarea name="answers[{{ $key }}]" rows="3" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none">{{ old("answers.$key", $brief->answers[$key] ?? '') }}</textarea>
                                @endif
                            </div>
                        @endforeach
                    </div>
                </div>
            @endforeach

            <button type="submit" class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest text-sm py-4 rounded-2xl shadow-lg shadow-orange-500/20 transition-colors">
                Enviar Brief
            </button>
        </form>

        <p class="text-center text-[11px] text-gray-400 mt-8">Limbani App</p>
    </div>

</body>
</html>
