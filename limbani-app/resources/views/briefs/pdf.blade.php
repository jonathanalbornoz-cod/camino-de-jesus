<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Brief Estratégico - {{ $project->name }}</title>
    <style>
        @page { margin: 28px 36px; }
        body { font-family: 'DejaVu Sans', sans-serif; color: #1f2937; font-size: 11px; }

        .header { border-bottom: 2px solid #f97316; padding-bottom: 12px; margin-bottom: 20px; }
        .header h1 { font-size: 20px; margin: 0 0 4px 0; color: #111827; }
        .header p { margin: 0; color: #6b7280; font-size: 11px; }
        .status {
            display: inline-block;
            margin-top: 8px;
            padding: 4px 10px;
            border-radius: 10px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #ffffff;
        }
        .status-draft { background-color: #9ca3af; }
        .status-submitted { background-color: #3b82f6; }
        .status-reviewed { background-color: #f59e0b; }
        .status-approved { background-color: #22c55e; }

        section { margin-bottom: 16px; page-break-inside: avoid; }
        .section-title {
            font-size: 13px;
            font-weight: bold;
            color: #111827;
            border-left: 4px solid #f97316;
            padding-left: 8px;
            margin-bottom: 8px;
        }
        .question {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 8px 10px;
            margin-bottom: 6px;
        }
        .question h4 {
            margin: 0 0 4px 0;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #9ca3af;
        }
        .question .value { font-size: 11px; color: #111827; line-height: 1.5; }
        .value .empty { color: #9ca3af; font-style: italic; }
        .value .tag {
            display: inline-block;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 2px 6px;
            margin: 0 4px 4px 0;
            font-size: 10px;
            font-weight: bold;
        }

        .empty-state { text-align: center; padding: 40px 0; color: #6b7280; }

        .footer { margin-top: 24px; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 9px; color: #9ca3af; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Reporte de Brief Estratégico</h1>
        <p>{{ $project->name }} &middot; {{ $brief->updated_at->translatedFormat('F Y') }}</p>
        <span class="status status-{{ $brief->status }}">
            {{ $statusLabels[$brief->status] ?? $brief->status }}
        </span>
    </div>

    @if(is_array($brief->answers))
        @foreach($sections as $section)
            <section>
                <div class="section-title">{{ $section['title'] }}</div>
                @foreach($section['qs'] as $key => $label)
                    @php $val = $brief->answers[$key] ?? null; @endphp
                    <div class="question">
                        <h4>{{ $label }}</h4>
                        <div class="value">
                            @if(is_array($val))
                                @forelse($val as $item)
                                    <span class="tag">{{ $item }}</span>
                                @empty
                                    <span class="empty">Sin respuesta</span>
                                @endforelse
                            @elseif($val)
                                {!! nl2br(e($val)) !!}
                            @else
                                <span class="empty">Sin respuesta</span>
                            @endif
                        </div>
                    </div>
                @endforeach
            </section>
        @endforeach
    @else
        <div class="empty-state">
            Este brief fue creado en una versión anterior y no tiene datos estructurados disponibles.
        </div>
    @endif

    <div class="footer">
        Generado el {{ now()->translatedFormat('d \d\e F \d\e Y, H:i') }} &middot; Limbani
    </div>
</body>
</html>
