@props(['project', 'size' => 'w-10 h-10', 'rounded' => 'rounded-xl', 'text' => 'text-sm'])

<div {{ $attributes->merge(['class' => "$size $rounded bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-bold $text overflow-hidden shrink-0 relative"]) }}>
    @if($project->logo)
        <img src="{{ asset('storage/' . $project->logo) }}" alt="{{ $project->name }}"
             class="absolute inset-0 w-full h-full object-cover"
             onerror="this.style.display='none'; this.nextElementSibling.classList.remove('hidden'); this.nextElementSibling.classList.add('flex');">
        <span class="hidden w-full h-full items-center justify-center">{{ strtoupper(substr($project->name, 0, 1)) }}</span>
    @else
        <span class="flex w-full h-full items-center justify-center">{{ strtoupper(substr($project->name, 0, 1)) }}</span>
    @endif
</div>
