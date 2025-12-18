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
    initScrollProgress();
    initMarqueePause();
    initParallax();
    initDirectionsAnimation();
    initStickyCTA();
    initCustomCursor();
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

/* =====================================================
   NEW ENHANCED FEATURES
   ===================================================== */

/* ===== Scroll Progress Bar ===== */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

/* ===== Marquee Pause on Hover ===== */
function initMarqueePause() {
    const marquees = document.querySelectorAll('.marquee');

    marquees.forEach(marquee => {
        const content = marquee.querySelector('.marquee__content');
        if (!content) return;

        marquee.addEventListener('mouseenter', () => {
            content.style.animationPlayState = 'paused';
        });

        marquee.addEventListener('mouseleave', () => {
            content.style.animationPlayState = 'running';
        });
    });
}

/* ===== Parallax Effect ===== */
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    const galleryImages = document.querySelectorAll('.about__gallery-main img, .about__gallery-grid img');

    // Add parallax to gallery images
    galleryImages.forEach(img => {
        img.setAttribute('data-parallax', '0.1');
    });

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        document.querySelectorAll('[data-parallax]').forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const rect = element.getBoundingClientRect();

            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = (rect.top - window.innerHeight) * speed;
                element.style.transform = `translateY(${yPos * 0.1}px)`;
            }
        });
    });
}

/* ===== Directions Steps Animation ===== */
function initDirectionsAnimation() {
    const steps = document.querySelectorAll('.directions__step');
    if (steps.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animations
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    steps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(30px)';
        observer.observe(step);
    });
}

/* ===== Sticky CTA in Navbar ===== */
function initStickyCTA() {
    const navbar = document.querySelector('.navbar');
    const heroCTA = document.querySelector('.hero__cta-main');

    if (!navbar || !heroCTA) return;

    // Create sticky CTA element
    const stickyCTA = document.createElement('a');
    stickyCTA.href = '#contact';
    stickyCTA.className = 'navbar__sticky-cta';
    stickyCTA.innerHTML = '🏋️ Essai Gratuit';
    stickyCTA.style.cssText = `
        display: none;
        background: var(--color-accent);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 100px;
        font-weight: 600;
        font-size: 0.85rem;
        text-decoration: none;
        margin-left: auto;
        transition: all 0.3s ease;
        animation: ctaPulse 3s ease-in-out infinite;
    `;

    // Insert before the toggle
    const navContainer = navbar.querySelector('.navbar__container');
    const toggle = navbar.querySelector('.navbar__toggle');
    if (navContainer && toggle) {
        navContainer.insertBefore(stickyCTA, toggle);
    }

    // Show/hide based on hero CTA visibility
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                stickyCTA.style.display = 'block';
            } else {
                stickyCTA.style.display = 'none';
            }
        });
    }, { threshold: 0 });

    observer.observe(heroCTA);

    // Smooth scroll for sticky CTA
    stickyCTA.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector('#contact');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

/* ===== Enhanced Counter Animation with Easing ===== */
function animateCounterEnhanced(element, target, duration = 2000) {
    const startTime = performance.now();
    const startValue = 0;

    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);

        element.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

/* ===== Custom Cursor Effect ===== */
function initCustomCursor() {
    // Only on desktop
    if (window.matchMedia('(hover: none)').matches) return;

    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursorFollower);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        // Cursor follows immediately
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX - 6 + 'px';
        cursor.style.top = cursorY - 6 + 'px';

        // Follower has delay
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        cursorFollower.style.left = followerX - 20 + 'px';
        cursorFollower.style.top = followerY - 20 + 'px';

        requestAnimationFrame(animate);
    }
    animate();

    // Expand on hoverable elements
    const hoverables = document.querySelectorAll('a, button, .btn, .service-card, .pricing-card, .google-review-card, .contact__item');

    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('expanded');
            cursorFollower.classList.add('expanded');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('expanded');
            cursorFollower.classList.remove('expanded');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '0.5';
    });
}
