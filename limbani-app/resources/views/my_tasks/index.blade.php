@extends('layouts.asana')

@section('content')
<div class="h-full w-full overflow-y-auto bg-white dark:bg-[#0f1012] text-gray-800 dark:text-white" x-data="{ view: '{{ $view }}' }">
    <div class="px-4 md:px-8 py-6 max-w-6xl mx-auto">

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                    <i class="fas fa-list-check"></i>
                </div>
                <h1 class="text-2xl md:text-3xl font-medium tracking-tight text-gray-900 dark:text-white">Mis Tareas</h1>
            </div>

            <div class="flex items-center gap-2 bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-full p-1 w-fit">
                <button type="button" @click="view = 'list'" :class="view === 'list' ? 'bg-white dark:bg-orange-500 text-gray-900 dark:text-black shadow-sm' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'" class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all">
                    <i class="fas fa-bars mr-1.5"></i> Lista
                </button>
                <button type="button" @click="view = 'board'" :class="view === 'board' ? 'bg-white dark:bg-orange-500 text-gray-900 dark:text-black shadow-sm' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'" class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all">
                    <i class="fas fa-columns mr-1.5"></i> Tablero
                </button>
                <button type="button" @click="view = 'calendar'" :class="view === 'calendar' ? 'bg-white dark:bg-orange-500 text-gray-900 dark:text-black shadow-sm' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'" class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all">
                    <i class="fas fa-calendar-alt mr-1.5"></i> Calendario
                </button>
            </div>
        </div>

        {{-- ===================== LISTA ===================== --}}
        <div x-show="view === 'list'" x-cloak class="space-y-8">

            @foreach([
                ['key' => 'overdue', 'title' => 'Vencidas', 'items' => $overdue, 'color' => 'text-red-500', 'open' => true],
                ['key' => 'upcoming', 'title' => 'Próximas', 'items' => $withDate, 'color' => 'text-orange-500', 'open' => true],
                ['key' => 'nodate', 'title' => 'Sin fecha', 'items' => $noDate, 'color' => 'text-gray-500', 'open' => true],
            ] as $group)
                @if($group['items']->count() > 0)
                <div x-data="{ open: {{ $group['open'] ? 'true' : 'false' }} }">
                    <button type="button" @click="open = !open" class="w-full flex items-center gap-2 mb-2 group">
                        <i class="fas fa-caret-right text-[10px] {{ $group['color'] }} transition-transform" :class="open ? 'rotate-90' : ''"></i>
                        <h3 class="text-xs font-bold uppercase tracking-widest {{ $group['color'] }}">{{ $group['title'] }}</h3>
                        <span class="text-[10px] text-gray-500 font-bold">{{ $group['items']->count() }}</span>
                    </button>
                    <div x-show="open" x-collapse class="space-y-1">
                        @foreach($group['items'] as $task)
                            <div @click="$dispatch('open-task', { task: @js($task), sectionTitle: @js($task->task->title ?? 'General'), parentTitle: @js($task->parent->title ?? '') })"
                                 class="group flex items-center gap-4 px-4 py-3 rounded-xl bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-orange-500/20 hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-all cursor-pointer">
                                <input type="checkbox" @click.stop
                                       @change="fetch('{{ url('/subtasks') }}/{{ $task->id }}', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': '{{ csrf_token() }}' }, body: JSON.stringify({ is_completed: $event.target.checked }) }).then(() => window.location.reload())"
                                       class="w-4 h-4 rounded-sm border-gray-400 dark:border-gray-600 bg-transparent checked:bg-green-500 shrink-0">

                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 mb-0.5">
                                        <span class="text-[9px] font-bold text-orange-500/80 uppercase tracking-tighter truncate">{{ $task->task->project->name ?? '' }}</span>
                                        @if($task->task)
                                            <i class="fas fa-chevron-right text-[6px] text-gray-600"></i>
                                            <span class="text-[9px] font-bold text-gray-500 uppercase tracking-tighter truncate">{{ $task->task->title }}</span>
                                        @endif
                                    </div>
                                    <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{{ $task->title }}</p>
                                </div>

                                @if($task->due_date)
                                    <span class="text-[10px] font-bold uppercase shrink-0 {{ $task->due_date->isPast() ? 'text-red-500' : 'text-gray-500' }}">
                                        {{ $task->due_date->format('d M, h:i A') }}
                                    </span>
                                @endif
                            </div>
                        @endforeach
                    </div>
                </div>
                @endif
            @endforeach

            <div x-data="{ open: false }">
                <button type="button" @click="open = !open" class="w-full flex items-center gap-2 mb-2 group">
                    <i class="fas fa-caret-right text-[10px] text-green-500 transition-transform" :class="open ? 'rotate-90' : ''"></i>
                    <h3 class="text-xs font-bold uppercase tracking-widest text-green-500">Completadas</h3>
                    <span class="text-[10px] text-gray-500 font-bold">{{ $completed->count() }}</span>
                </button>
                <div x-show="open" x-collapse class="space-y-1">
                    @forelse($completed as $task)
                        <div @click="$dispatch('open-task', { task: @js($task), sectionTitle: @js($task->task->title ?? 'General'), parentTitle: @js($task->parent->title ?? '') })"
                             class="group flex items-center gap-4 px-4 py-3 rounded-xl bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-orange-500/20 transition-all cursor-pointer opacity-60 hover:opacity-100">
                            <input type="checkbox" checked @click.stop
                                   @change="fetch('{{ url('/subtasks') }}/{{ $task->id }}', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': '{{ csrf_token() }}' }, body: JSON.stringify({ is_completed: $event.target.checked }) }).then(() => window.location.reload())"
                                   class="w-4 h-4 rounded-sm border-gray-400 dark:border-gray-600 bg-transparent checked:bg-green-500 shrink-0">
                            <p class="flex-1 min-w-0 text-sm font-medium text-gray-500 line-through truncate">{{ $task->title }}</p>
                        </div>
                    @empty
                        <p class="text-xs text-gray-600 italic px-4">Nada completado todavía.</p>
                    @endforelse
                </div>
            </div>

            @if($overdue->count() + $withDate->count() + $noDate->count() === 0)
                <div class="text-center py-16">
                    <i class="fas fa-mug-hot text-3xl text-gray-300 dark:text-gray-700 mb-3"></i>
                    <p class="text-gray-500 text-sm">No tienes tareas pendientes. ¡Buen trabajo!</p>
                </div>
            @endif
        </div>

        {{-- ===================== TABLERO ===================== --}}
        <div x-show="view === 'board'" x-cloak class="grid grid-cols-1 md:grid-cols-3 gap-4">
            @foreach([
                ['title' => 'Vencidas', 'items' => $overdue, 'color' => 'border-red-500/30 text-red-500'],
                ['title' => 'Por hacer', 'items' => $withDate->concat($noDate), 'color' => 'border-orange-500/30 text-orange-500'],
                ['title' => 'Completadas', 'items' => $completed, 'color' => 'border-green-500/30 text-green-500'],
            ] as $col)
                <div class="bg-gray-50/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-2xl p-4">
                    <div class="flex items-center justify-between mb-4 px-1">
                        <h3 class="text-xs font-bold uppercase tracking-widest {{ $col['color'] }}">{{ $col['title'] }}</h3>
                        <span class="text-[10px] text-gray-500 font-bold">{{ $col['items']->count() }}</span>
                    </div>
                    <div class="space-y-2 max-h-[65vh] overflow-y-auto custom-scroll pr-1">
                        @forelse($col['items'] as $task)
                            <div @click="$dispatch('open-task', { task: @js($task), sectionTitle: @js($task->task->title ?? 'General'), parentTitle: @js($task->parent->title ?? '') })"
                                 class="p-3 rounded-xl bg-white dark:bg-[#1a1a1a] border {{ $col['color'] }} hover:shadow-md transition-all cursor-pointer">
                                <div class="text-[9px] font-bold text-gray-500 uppercase tracking-tighter mb-1 truncate">{{ $task->task->project->name ?? '' }}</div>
                                <p class="text-sm font-medium text-gray-800 dark:text-gray-200 {{ $task->is_completed ? 'line-through opacity-60' : '' }}">{{ $task->title }}</p>
                                @if($task->due_date)
                                    <div class="text-[10px] font-bold uppercase mt-2 {{ $task->due_date->isPast() && !$task->is_completed ? 'text-red-500' : 'text-gray-500' }}">
                                        {{ $task->due_date->format('d M, h:i A') }}
                                    </div>
                                @endif
                            </div>
                        @empty
                            <p class="text-[11px] text-gray-600 italic px-1">Sin tareas.</p>
                        @endforelse
                    </div>
                </div>
            @endforeach
        </div>

        {{-- ===================== CALENDARIO ===================== --}}
        <div x-show="view === 'calendar'" x-cloak>
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <a href="{{ route('my-tasks.index', ['view' => 'calendar', 'month' => $month->copy()->subMonth()->format('Y-m')]) }}" class="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500"><i class="fas fa-chevron-left text-xs"></i></a>
                    <a href="{{ route('my-tasks.index', ['view' => 'calendar']) }}" class="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500">Hoy</a>
                    <a href="{{ route('my-tasks.index', ['view' => 'calendar', 'month' => $month->copy()->addMonth()->format('Y-m')]) }}" class="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500"><i class="fas fa-chevron-right text-xs"></i></a>
                    <span class="text-sm font-medium text-gray-800 dark:text-white capitalize ml-2">{{ $month->translatedFormat('F Y') }}</span>
                </div>
                <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full">Sin fecha ({{ $noDateCount }})</span>
            </div>

            <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-white/5 rounded-xl overflow-hidden border border-gray-200 dark:border-white/5">
                @foreach(['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] as $dayName)
                    <div class="bg-gray-50 dark:bg-[#141414] text-center py-2 text-[9px] font-bold uppercase tracking-widest text-gray-500">{{ $dayName }}</div>
                @endforeach

                @foreach($calendarWeeks as $week)
                    @foreach($week as $day)
                        @php
                            $dayKey = $day->format('Y-m-d');
                            $dayTasks = $tasksByDate->get($dayKey, collect());
                            $inMonth = $day->month === $month->month;
                            $isToday = $day->isToday();
                        @endphp
                        <div class="bg-white dark:bg-[#0f1012] min-h-[110px] p-2 {{ !$inMonth ? 'opacity-30' : '' }}">
                            <div class="flex justify-end">
                                <span class="w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-bold {{ $isToday ? 'bg-orange-500 text-black' : 'text-gray-500' }}">{{ $day->day }}</span>
                            </div>
                            <div class="space-y-1 mt-1">
                                @foreach($dayTasks->take(3) as $task)
                                    <div @click="$dispatch('open-task', { task: @js($task), sectionTitle: @js($task->task->title ?? 'General'), parentTitle: @js($task->parent->title ?? '') })"
                                         class="text-[9px] font-medium px-1.5 py-1 rounded-md truncate cursor-pointer {{ $task->is_completed ? 'bg-green-500/10 text-green-600 dark:text-green-400 line-through' : ($task->due_date->isPast() ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500') }}">
                                        {{ $task->title }}
                                    </div>
                                @endforeach
                                @if($dayTasks->count() > 3)
                                    <div class="text-[9px] text-gray-500 font-bold pl-1.5">+{{ $dayTasks->count() - 3 }} más</div>
                                @endif
                            </div>
                        </div>
                    @endforeach
                @endforeach
            </div>
        </div>

    </div>
</div>
@endsection
