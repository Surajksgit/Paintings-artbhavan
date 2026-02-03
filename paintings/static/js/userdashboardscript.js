document.addEventListener('DOMContentLoaded', () => {
    // 1. Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.error('GSAP not loaded');
        return;
    }

    // 2. Initialize GSAP Plugins
    try {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    } catch (e) {
        console.error('GSAP Plugin registration failed:', e);
    }

    // 3. Initialize Lenis Smooth Scroll
    let lenis;
    try {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    } catch (e) {
        console.warn('Lenis scroll failed to initialize:', e);
    }

    // 4. Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            gsap.to(cursorDot, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1
            });
            gsap.to(cursorOutline, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3
            });
        });

        // Cursor hover effects
        const interactiveElements = document.querySelectorAll('a, button, .artwork-card, .filter-select');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursorOutline, { scale: 1.5, borderColor: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.1)', duration: 0.3 });
                gsap.to(cursorDot, { scale: 0, duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursorOutline, { scale: 1, borderColor: '#D4AF37', backgroundColor: 'transparent', duration: 0.3 });
                gsap.to(cursorDot, { scale: 1, duration: 0.3 });
            });
        });
    }

    // 5. Hero Animation
    const heroTitleTag = document.querySelector('.hero-title');
    if (heroTitleTag && typeof SplitType !== 'undefined') {
        const heroTitle = new SplitType('.hero-title', { types: 'chars' });
        const heroSubtitle = new SplitType('.hero-subtitle', { types: 'lines' });

        const tl = gsap.timeline();

        // Initial state set to ensure visibility if JS runs
        gsap.set(['.hero-title', '.hero-subtitle', '.stat-item'], { opacity: 1 });

        tl.from('.main-nav', {
            y: -100,
            opacity: 0,
            duration: 1.2,
            ease: 'power4.out'
        })
            .from(heroTitle.chars, {
                opacity: 0,
                y: 50,
                rotateX: -90,
                stagger: 0.02,
                duration: 1,
                ease: 'back.out(1.7)'
            }, "-=0.8")
            .from(heroSubtitle.lines, {
                opacity: 0,
                y: 20,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out'
            }, "-=0.5")
            .from('.stat-item', {
                opacity: 0,
                y: 30,
                stagger: 0.15,
                duration: 1,
                ease: 'power2.out'
            }, "-=0.6");
    }

    // 6. Parallax Hero Background
    if (document.querySelector('.hero-parallax-bg')) {
        gsap.to('.hero-parallax-bg', {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    // 7. Navbar Scroll Effect
    const mainNav = document.querySelector('.main-nav');
    if (mainNav) {
        ScrollTrigger.create({
            start: 'top -50',
            onUpdate: (self) => {
                if (self.direction === 1) {
                    mainNav.classList.add('scrolled');
                } else {
                    if (window.scrollY < 50) {
                        mainNav.classList.remove('scrolled');
                    }
                }
            }
        });
    }

    // 8. Parallax Image Cycling
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    if (parallaxLayers.length > 0) {
        let currentLayer = 0;
        function cycleLayers() {
            parallaxLayers.forEach(layer => layer.classList.remove('active'));
            currentLayer = (currentLayer + 1) % parallaxLayers.length;
            parallaxLayers[currentLayer].classList.add('active');
        }
        setInterval(cycleLayers, 6000);
    }

    // 9. Artwork Cards Entry Animation
    if (document.querySelector('.artwork-card')) {
        gsap.from('.artwork-card', {
            scrollTrigger: {
                trigger: '.artworks-grid',
                start: 'top 85%',
            },
            opacity: 0,
            y: 40,
            stagger: 0.1,
            duration: 1,
            ease: 'power4.out'
        });
    }

    // 10. Flash Messages Animation
    const flashMessages = document.querySelector('.flash-message');
    if (flashMessages) {
        gsap.from('.flash-message', {
            x: 50,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: 'back.out(1.7)'
        });

        setTimeout(() => {
            gsap.to('.flash-message', {
                opacity: 0,
                x: 20,
                stagger: 0.1,
                duration: 0.5,
                onComplete: () => {
                    const container = document.querySelector('.flash-messages-container');
                    if (container) container.remove();
                }
            });
        }, 5000);
    }
});
