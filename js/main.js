/* =====================================================
   VO2MAX LYON - MAIN JAVASCRIPT
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavbar();
    initSmoothScroll();
    initScrollReveal();
    initBackToTop();
    initMobileMenu();
});

/* ===== Page Loader ===== */
function initLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = 'visible';
        }, 800);
    });
}

/* ===== Navbar Scroll Effect ===== */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
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

            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* ===== Scroll Reveal Animation ===== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    if (reveals.length === 0) return;

    const revealOnScroll = () => {
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('revealed');
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
    const overlay = document.createElement('div');

    if (!toggle || !nav) return;

    overlay.className = 'mobile-overlay';
    overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 299;
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

    // Close menu on link click
    nav.querySelectorAll('.navbar__link').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('open')) {
                toggleMenu();
            }
        });
    });
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

/* ===== Intersection Observer for Counters ===== */
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

// Initialize counters
document.addEventListener('DOMContentLoaded', initCounters);

/* ===== Active Navigation Link ===== */
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar__link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath === href || (currentPath === '/' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', setActiveNavLink);
