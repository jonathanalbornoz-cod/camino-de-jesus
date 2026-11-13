{{-- Logotipo ImporDental: contorno de diente + nombre + lema. $compact oculta el lema. --}}
<span class="logo {{ $class ?? '' }}">
    <svg class="logo__tooth" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M21 7C10.5 7 5.6 15 6.8 24c1 7.6 4.2 11.8 5.3 19.6C13.2 51.8 15.4 58 19.6 58c4.3 0 5.4-9.6 8.6-13.6 1.3-1.6 2.5-2.4 3.8-2.4s2.5.8 3.8 2.4c3.2 4 4.3 13.6 8.6 13.6 4.2 0 6.4-6.2 7.5-14.4 1.1-7.8 4.3-12 5.3-19.6C58.4 15 53.5 7 43 7c-5 0-7.6 3.2-11 3.2S26 7 21 7Z" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/>
    </svg>
    <span class="logo__text">
        <span class="logo__name">Impor<b>Dental</b></span>
        @unless($compact ?? false)
            <span class="logo__tag">Equipos y materiales odontológicos</span>
        @endunless
    </span>
</span>
