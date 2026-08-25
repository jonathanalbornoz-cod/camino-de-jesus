// =========================
// COUNTER ANIMATION
// =========================
const counters = document.querySelectorAll('.counter');

const startCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const increment = target / 60;

    const updateCounter = () => {
        count += increment;
        if (count < target) {
            counter.innerText = Math.ceil(count);
            requestAnimationFrame(updateCounter);
        } else {
            if (target === 1500) counter.innerText = '+1500';
            else if (target === 98) counter.innerText = '98%';
            else counter.innerText = target + '+';
        }
    };
    updateCounter();
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCounter(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.6 });

counters.forEach(counter => observer.observe(counter));

// =========================
// NAVBAR SCROLL + MOBILE MENU
// =========================
const header = document.getElementById('header');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');
const closeMenuBtn = document.getElementById('close-menu');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

function openMenu() {
    navLinks.classList.add('active');
    mobileMenu.classList.add('active');
}

function closeMenu() {
    navLinks.classList.remove('active');
    mobileMenu.classList.remove('active');
}

mobileMenu.addEventListener('click', openMenu);
closeMenuBtn.addEventListener('click', closeMenu);

navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && !e.target.classList.contains('lang-btn')) closeMenu();
});

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closeMenu();
});

// =========================
// FORM HONEYPOT
// =========================
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        const honeypot = form.querySelector('.honeypot');
        if (honeypot && honeypot.value !== '') {
            e.preventDefault();
            console.log('Bot detectado');
        }
    });
}

// =========================
// IMAGE PROTECTION
// =========================
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') e.preventDefault();
});

// =========================
// BEFORE & AFTER SLIDER (Versión Única y Estable)
// =========================
function initBeforeAfter() {
    const container = document.getElementById('comparison');
    if (!container) return;

    const slider = document.getElementById('slider');
    const afterImg = container.querySelector('.after-img');

    if (!slider || !afterImg) {
        console.warn("Before & After: Elementos no encontrados");
        return;
    }

    let isDragging = false;

    function moveSlider(clientX) {
        const rect = container.getBoundingClientRect();
        let percentage = ((clientX - rect.left) / rect.width) * 100;
        percentage = Math.max(5, Math.min(95, percentage));

        slider.style.left = `${percentage}%`;
        afterImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    }

    // Mouse
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        moveSlider(e.clientX);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) moveSlider(e.clientX);
    });

    document.addEventListener('mouseup', () => isDragging = false);

    // Touch (Móviles)
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        moveSlider(e.touches[0].clientX);
    });

    container.addEventListener('touchmove', (e) => {
        if (isDragging) moveSlider(e.touches[0].clientX);
    });

    document.addEventListener('touchend', () => isDragging = false);
}

// =========================
// INICIALIZACIÓN GENERAL
// =========================
document.addEventListener('DOMContentLoaded', () => {
    initBeforeAfter();
    // Aquí puedes agregar otros init si los necesitas
    console.log("✅ Todos los scripts inicializados correctamente");
});

// =========================
// BEFORE & AFTER - 2 PACIENTES (Compatible con tu JS)
// =========================
function initBeforeAfterMulti() {
    const sliders = [
        { containerId: 'comparison-1', sliderId: 'slider-1' },
        { containerId: 'comparison-2', sliderId: 'slider-2' }
    ];

    sliders.forEach(({ containerId, sliderId }) => {
        const container = document.getElementById(containerId);
        const slider = document.getElementById(sliderId);
        const afterImg = container ? container.querySelector('.after-img') : null;

        if (!container || !slider || !afterImg) return;

        let isDragging = false;

        function moveSlider(clientX) {
            const rect = container.getBoundingClientRect();
            let percentage = ((clientX - rect.left) / rect.width) * 100;
            percentage = Math.max(5, Math.min(95, percentage));

            slider.style.left = `${percentage}%`;
            afterImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        }

        // Mouse
        container.addEventListener('mousedown', e => { isDragging = true; moveSlider(e.clientX); });
        document.addEventListener('mousemove', e => { if (isDragging) moveSlider(e.clientX); });
        document.addEventListener('mouseup', () => isDragging = false);

        // Touch
        container.addEventListener('touchstart', e => { isDragging = true; moveSlider(e.touches[0].clientX); });
        container.addEventListener('touchmove', e => { if (isDragging) moveSlider(e.touches[0].clientX); });
        document.addEventListener('touchend', () => isDragging = false);
    });
}

// Inicializar (agrega esta línea al final del DOMContentLoaded que ya tienes)
document.addEventListener('DOMContentLoaded', initBeforeAfterMulti);

// =========================
// ANIMACIÓN DE DOCUMENTOS AL HACER SCROLL
// =========================
function initDocumentosAnimation() {
    const items = document.querySelectorAll('.documento-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, entry.target.dataset.delay || index * 100);
            }
        });
    }, {
        threshold: 0.2
    });

    items.forEach(item => observer.observe(item));
}

document.addEventListener('DOMContentLoaded', initDocumentosAnimation);

// =========================
// VIDEO CON PLAY / PAUSE
// =========================
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video-nosotros');
    const overlay = document.getElementById('play-overlay');
    const playIcon = document.getElementById('play-icon');

    if (!video || !overlay) return;

    function toggleVideo() {
        if (video.paused) {
            video.muted = false;
            video.play().then(() => {
                overlay.style.opacity = '0';
            }).catch(() => {
                video.muted = true;
                video.play();
                overlay.style.opacity = '0';
            });
        } else {
            video.pause();
            overlay.style.opacity = '1';
        }
    }

    overlay.addEventListener('click', toggleVideo);

    // Doble clic para pausar/reproducir también
    video.addEventListener('click', toggleVideo);
});

// =========================
// BILINGUAL SYSTEM (LANGUAGE SWITCHER)
// =========================
function setLanguage(lang) {
    if (typeof translations === 'undefined' || !translations || !translations[lang]) return;

    // Save preference
    localStorage.setItem('lang', lang);

    // Update all elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key] !== undefined) {
            // For inputs/textareas: update placeholder
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            }
            // For OPTION elements: update text only
            else if (el.tagName === 'OPTION') {
                el.textContent = translations[lang][key];
            }
            // For LABEL elements: update text only (no HTML injection)
            else if (el.tagName === 'LABEL') {
                el.textContent = translations[lang][key];
            }
            // For everything else: use innerHTML to support icons/HTML
            else {
                el.innerHTML = translations[lang][key];
            }
        }
    });

    // Update active class on language switcher buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Determine language to load
    const savedLang = localStorage.getItem('lang') || 'es';
    setLanguage(savedLang);

    // 2. Add event listeners to switcher buttons
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent mobile menu close handler from firing
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // 3. Experience Carousel
    initExperienceCarousel();
});


// =========================
// EXPERIENCE CAROUSEL
// =========================
function initExperienceCarousel() {
    const slides = document.querySelectorAll('.experience-slide');
    const dotsContainer = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    
    if (!slides.length || !dotsContainer) return;
    
    let currentSlide = 0;
    let autoPlayInterval;
    const AUTOPLAY_DELAY = 6000;

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dotsContainer.children[currentSlide].classList.remove('active');
        
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        slides[currentSlide].classList.add('active');
        dotsContainer.children[currentSlide].classList.add('active');
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    // Button events
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

    // Autoplay
    function startAutoplay() {
        autoPlayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
    }
    function resetAutoplay() {
        clearInterval(autoPlayInterval);
        startAutoplay();
    }
    startAutoplay();

    // Pause on hover
    const wrapper = document.querySelector('.experience-carousel-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        wrapper.addEventListener('mouseleave', () => startAutoplay());
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!isElementInViewport(wrapper)) return;
        if (e.key === 'ArrowRight') { nextSlide(); resetAutoplay(); }
        if (e.key === 'ArrowLeft') { prevSlide(); resetAutoplay(); }
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const carousel = document.getElementById('experienceCarousel');
    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
                resetAutoplay();
            }
        }, { passive: true });
    }
}

function isElementInViewport(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return (
        rect.top < window.innerHeight &&
        rect.bottom > 0
    );
}