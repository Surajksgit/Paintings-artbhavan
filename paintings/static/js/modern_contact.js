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
    const interactiveElements = document.querySelectorAll('a, button, .input-modern, .social-btn');
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

    // 3. Entrance Animations
    const tl = gsap.timeline();
    const title = new SplitType('.contact-title', { types: 'words, chars' });

    tl.from('.glass-nav', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    })
        .from(title.chars, {
            y: 80,
            opacity: 0,
            stagger: 0.03,
            duration: 1,
            ease: 'expo.out'
        }, '-=0.5')
        .from('.contact-subtitle', {
            y: 20,
            opacity: 0,
            duration: 0.8
        }, '-=0.8')
        .from('.hero-bg-text', {
            scale: 0.8,
            opacity: 0,
            duration: 2,
            ease: 'power2.out'
        }, '-=1.2')
        .from('.contact-wrapper', {
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: 'expo.out'
        }, '-=1.2');

    // 4. Form Fields Animation
    gsap.from('.form-group-modern', {
        scrollTrigger: {
            trigger: '.contact-form-side',
            start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out'
    });

    // 5. Info Items Animation
    gsap.from('.info-item', {
        scrollTrigger: {
            trigger: '.contact-info-side',
            start: 'top 80%',
        },
        x: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out'
    });

    // 6. Background Text Parallax
    gsap.to('.hero-bg-text', {
        scrollTrigger: {
            trigger: '.contact-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 150,
        opacity: 0.05
    });

    // 7. Input Focus Animations (Already handled by CSS, but we can add GSAP)
    const inputs = document.querySelectorAll('.input-modern');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                scale: 1.01,
                duration: 0.3
            });
        });
        input.addEventListener('blur', () => {
            gsap.to(input, {
                scale: 1,
                duration: 0.3
            });
        });
    });
});
