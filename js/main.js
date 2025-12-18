/* =====================================================
   VO2MAX LYON - JAVASCRIPT CONSOLIDÉ
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavbar();
    initSmoothScroll();
    initScrollReveal();
    initBackToTop();
    initMobileMenu();
    initCounters();
});

/* ===== Page Loader ===== */
function initLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = 'visible';
        }, 1000);
    });
}

/* ===== Navbar Scroll Effect ===== */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ===== Smooth Scroll ===== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const navbarHeight = 100;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const nav = document.querySelector('.navbar__nav');
            const toggle = document.querySelector('.navbar__toggle');
            if (nav && nav.classList.contains('open')) {
                nav.classList.remove('open');
                toggle?.classList.remove('active');
            }
        });
    });
}

/* ===== Scroll Reveal Animation ===== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    const revealOnScroll = () => {
        reveals.forEach((element, index) => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                // Add stagger delay
                setTimeout(() => {
                    element.classList.add('revealed');
                }, index * 50);
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
}

/* ===== Back to Top Button ===== */
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ===== Mobile Menu ===== */
function initMobileMenu() {
    const toggle = document.querySelector('.navbar__toggle');
    const nav = document.querySelector('.navbar__nav');

    if (!toggle || !nav) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  `;
    document.body.appendChild(overlay);

    const toggleMenu = () => {
        const isOpen = nav.classList.contains('open');
        nav.classList.toggle('open');
        toggle.classList.toggle('active');

        if (!isOpen) {
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
            document.body.style.overflow = 'hidden';
        } else {
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            document.body.style.overflow = '';
        }
    };

    toggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
}

/* ===== Counter Animation ===== */
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.counter);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

/* ===== Form Handling ===== */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const message = formData.get('message');

        // Create WhatsApp message
        const whatsappMessage = `Salut ! Je suis ${name}.%0A%0AEmail: ${email}${phone ? '%0ATél: ' + phone : ''}${message ? '%0A%0AMessage: ' + message : ''}%0A%0AJe voudrais des infos sur VO2Max ! 💪`;

        // Redirect to WhatsApp
        window.open(`https://wa.me/33437289014?text=${whatsappMessage}`, '_blank');

        // Show success message
        alert('Super ! On t\'a redirigé vers WhatsApp pour finaliser ta demande 🏋️');
        this.reset();
    });
}
