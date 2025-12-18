/* =====================================================
   VO2MAX LYON - JAVASCRIPT CONSOLIDÉ + AMÉLIORATIONS
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavbar();
    initNavbarScrollSpy();
    initSmoothScroll();
    initScrollReveal();
    initBackToTop();
    initMobileMenu();
    initCounters();
    initTiltCards();
    initFloatingLabels();
    initCtaPulse();
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

/* ===== Navbar Scroll Spy (Active Link) ===== */
function initNavbarScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar__link[href^="#"]');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                // Remove active from all links
                navLinks.forEach(link => link.classList.remove('active'));

                // Add active to current link
                const activeLink = document.querySelector(`.navbar__link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
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
                setTimeout(() => {
                    element.classList.add('revealed');
                }, index * 50);
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
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

    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
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

/* ===== 3D Tilt Effect on Cards ===== */
function initTiltCards() {
    const cards = document.querySelectorAll('.service-card, .pricing-card, .testimonial-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

/* ===== Floating Labels ===== */
function initFloatingLabels() {
    const formGroups = document.querySelectorAll('.form-group');

    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        if (!input) return;

        // Get placeholder text
        const placeholder = input.getAttribute('placeholder');
        if (!placeholder) return;

        // Create floating label
        const label = document.createElement('label');
        label.className = 'floating-label';
        label.textContent = placeholder;
        label.setAttribute('for', input.id);

        // Add class to input for styling
        input.classList.add('has-floating-label');
        input.setAttribute('placeholder', ' '); // Empty placeholder for CSS :placeholder-shown

        // Insert label
        group.style.position = 'relative';
        group.appendChild(label);

        // Check if input has value on load
        if (input.value) {
            label.classList.add('active');
        }

        // Focus/blur events
        input.addEventListener('focus', () => {
            label.classList.add('active');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                label.classList.remove('active');
            }
        });

        input.addEventListener('input', () => {
            if (input.value) {
                label.classList.add('active');
            }
        });
    });
}

/* ===== CTA Pulse Animation ===== */
function initCtaPulse() {
    const ctaButtons = document.querySelectorAll('.navbar__cta, .hero__ctas .btn--primary');

    ctaButtons.forEach(btn => {
        // Add pulse class periodically
        setInterval(() => {
            btn.classList.add('pulse');
            setTimeout(() => {
                btn.classList.remove('pulse');
            }, 1000);
        }, 5000);
    });
}

/* ===== Form Handling ===== */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Show loading state
        if (submitBtn) {
            submitBtn.innerHTML = '<span class="btn-spinner"></span> Envoi...';
            submitBtn.disabled = true;
        }

        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const message = formData.get('message');

        // Simulate delay then redirect
        setTimeout(() => {
            const whatsappMessage = `Salut ! Je suis ${name}.%0A%0AEmail: ${email}${phone ? '%0ATél: ' + phone : ''}${message ? '%0A%0AMessage: ' + message : ''}%0A%0AJe voudrais des infos sur VO2Max ! 💪`;

            window.open(`https://wa.me/33437289014?text=${whatsappMessage}`, '_blank');

            // Show success state
            if (submitBtn) {
                submitBtn.innerHTML = '✓ Envoyé !';
                submitBtn.classList.add('btn--success');

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('btn--success');
                }, 3000);
            }

            this.reset();

            // Reset floating labels
            document.querySelectorAll('.floating-label').forEach(label => {
                label.classList.remove('active');
            });
        }, 800);
    });
}
