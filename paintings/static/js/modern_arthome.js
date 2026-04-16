document.addEventListener('DOMContentLoaded', () => {
    // 0. Scroll Header Effect
    const header = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 1. Initial GSAP Setup
    gsap.registerPlugin(ScrollTrigger);

    // 2. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
        gsap.to(follower, {
            x: e.clientX - 11,
            y: e.clientY - 11,
            duration: 0.3
        });
    });

    // Cursor hover effects
    const interactiveElements = document.querySelectorAll('a, button, .immersive-card, .dropdown-trigger, .btn-premium, .btn-outline, .btn-minimal');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(follower, {
                scale: 2,
                backgroundColor: 'rgba(243, 156, 18, 0.1)',
                borderColor: 'transparent',
                duration: 0.3
            });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(follower, {
                scale: 1,
                backgroundColor: 'transparent',
                borderColor: '#f39c12',
                duration: 0.3
            });
        });
    });

    // 3. Loader Animation
    const loader = document.getElementById('loader');
    const loaderBar = document.querySelector('.loader-bar');

    // Simulate loading
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            // Hide loader
            const tl = gsap.timeline();
            tl.to(loaderBar, { width: '100%', duration: 0.5 })
                .to(loader, {
                    y: '-100%',
                    duration: 1,
                    ease: 'expo.inOut',
                    onComplete: () => {
                        loader.style.display = 'none';
                        startHeroAnimations();
                    }
                });
        }
        loaderBar.style.width = progress + '%';
    }, 200);

    // 4. Hero Animations
    function startHeroAnimations() {
        // Split Text for Title
        const heroTitleNodes = document.querySelector('.hero-title');
        if (heroTitleNodes) {
            new SplitType('.hero-title', { types: 'words, chars' });
        }

        const tl = gsap.timeline();

        // Reveal Nav and Buttons Immediately
        gsap.to(['.nav-container', '.nav-actions'], {
            opacity: 1,
            visibility: 'visible',
            duration: 0.5
        });

        tl.from(['.nav-container'], {
            y: -30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        })
            .from('.hero-title .char', {
                y: 50,
                opacity: 0,
                stagger: 0.02,
                duration: 0.8,
                ease: 'expo.out'
            }, '-=0.5')
            .from('[data-gsap="fade-up"]', {
                y: 30,
                opacity: 0,
                stagger: 0.15,
                duration: 1,
                ease: 'power3.out',
                clearProps: 'all'
            }, '-=0.6')
            .from('.visual-wrapper', {
                scale: 0.9,
                opacity: 0,
                duration: 1.2,
                ease: 'expo.out'
            }, '-=0.8');
    }

    // 5. Parallax Effect
    document.addEventListener('mousemove', (e) => {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        const x = (e.clientX - window.innerWidth / 2) * 0.01;
        const y = (e.clientY - window.innerHeight / 2) * 0.01;

        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-speed') || 0.05;
            gsap.to(el, {
                x: x * speed * 100,
                y: y * speed * 100,
                duration: 0.5
            });
        });
    });

    // 6. ScrollTrigger Reveal for Featured Section and Cards
    gsap.from('.section-header h2', {
        scrollTrigger: {
            trigger: '.featured-section',
            start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.art-gallery-card', {
        scrollTrigger: {
            trigger: '.featured-section',
            start: 'top 70%',
        },
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: 'expo.out'
    });

    // 7. New Immersive Swiper Initialization
    const mainSwiperEl = document.querySelector('.main-featured-swiper');
    if (mainSwiperEl) {
        const featuredSwiper = new Swiper('.main-featured-swiper', {
            slidesPerView: 1.2,
            spaceBetween: 30,
            centeredSlides: false,
            grabCursor: true,
            loop: false,
            speed: 1000,
            navigation: {
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2.2,
                    spaceBetween: 40,
                },
                1200: {
                    slidesPerView: 3.2,
                    spaceBetween: 60,
                },
            },
            on: {
                init: function () {
                    updateProgressBar(this);
                },
                slideChange: function () {
                    updateProgressBar(this);
                    // Animate current slide content
                    gsap.from(this.slides[this.activeIndex].querySelectorAll('.card-info-box > *'), {
                        y: 20,
                        opacity: 0,
                        stagger: 0.1,
                        duration: 0.8,
                        ease: 'power2.out'
                    });
                }
            }
        });

        function updateProgressBar(swiper) {
            const progress = (swiper.activeIndex / (swiper.slides.length - swiper.params.slidesPerView)) * 100;
            gsap.to('.progress-fill', {
                width: `${Math.min(Math.max(progress, 0), 100)}%`,
                duration: 0.4
            });
        }
    }

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu > a, .nav-menu .dropdown-trigger, .nav-actions-mobile > *, .mobile-cat-links a');

    let isMenuOpen = false;

    const menuTl = gsap.timeline({ paused: true });

    menuTl.to(navMenu, {
        right: 0,
        duration: 0.8,
        ease: 'expo.inOut'
    })
        .from(navLinks, {
            y: -30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power3.out'
        }, '-=0.4');

    mobileToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        mobileToggle.classList.toggle('active');

        if (isMenuOpen) {
            navMenu.classList.add('active');
            menuTl.play();
            document.body.style.overflow = 'hidden';
        } else {
            menuTl.reverse();
            setTimeout(() => {
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }, 800);
        }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                isMenuOpen = false;
                mobileToggle.classList.remove('active');
                menuTl.reverse();
                setTimeout(() => {
                    navMenu.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }, 800);
            }
        });
    });
});
