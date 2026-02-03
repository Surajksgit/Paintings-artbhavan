document.addEventListener('DOMContentLoaded', () => {
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
    const interactiveElements = document.querySelectorAll('a, button, .mission-card');
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

    // 3. Page Entrance Animations
    const tl = gsap.timeline();
    const title = new SplitType('.about-title', { types: 'words, chars' });

    tl.from('.glass-nav', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    })
        .from(title.chars, {
            y: 80,
            opacity: 0,
            stagger: 0.05,
            duration: 1,
            ease: 'expo.out'
        }, '-=0.5')
        .from('.about-subtitle', {
            y: 20,
            opacity: 0,
            duration: 0.8
        }, '-=0.8')
        .from('.hero-bg-text', {
            scale: 0.8,
            opacity: 0,
            duration: 2,
            ease: 'power2.out'
        }, '-=1.2');

    // 4. Parallax Background Text
    gsap.to('.hero-bg-text', {
        scrollTrigger: {
            trigger: '.about-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        x: '20%',
        opacity: 0.05
    });

    // 5. Section Reveals
    gsap.from('.story-image-wrapper', {
        scrollTrigger: {
            trigger: '.story-section',
            start: 'top 80%',
        },
        x: -100,
        opacity: 0,
        duration: 1.5,
        ease: 'expo.out'
    });

    gsap.from('.story-content > *', {
        scrollTrigger: {
            trigger: '.story-section',
            start: 'top 70%',
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out'
    });

    // 6. Mission Cards Animation
    gsap.from('.mission-card', {
        scrollTrigger: {
            trigger: '.mission-section',
            start: 'top 80%',
        },
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: 'expo.out'
    });

    // 7. Image Parallax
    gsap.to('.story-image-wrapper img', {
        scrollTrigger: {
            trigger: '.story-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        },
        scale: 1.2
    });
});
