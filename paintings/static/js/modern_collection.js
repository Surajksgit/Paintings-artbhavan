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
    const interactiveElements = document.querySelectorAll('a, button, .art-card-modern, .select-btn');
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

    // 3. Collection Entrance Animations
    const tl = gsap.timeline();

    // Split Text for Title
    const collectionTitle = new SplitType('.collection-title', { types: 'words, chars' });

    tl.from('.glass-nav', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    })
        .from(collectionTitle.chars, {
            y: 80,
            opacity: 0,
            stagger: 0.02,
            duration: 1,
            ease: 'expo.out'
        }, '-=0.5')
        .from('.collection-subtitle', {
            y: 20,
            opacity: 0,
            duration: 0.8
        }, '-=0.8')
        .from('.hero-bg-text', {
            scale: 0.5,
            opacity: 0,
            duration: 2,
            ease: 'power2.out'
        }, '-=1.2')
        .from('.filter-bar', {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'expo.out'
        }, '-=1');

    // 4. Staggered Grid Reveal
    const gridItems = document.querySelectorAll('.art-card-modern');
    if (gridItems.length > 0) {
        gsap.from(gridItems, {
            scrollTrigger: {
                trigger: '.collection-grid-container',
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            stagger: 0.1,
            duration: 1,
            ease: 'power3.out',
            clearProps: 'all' // Ensures opacity: 1 and transform: none after animation
        });
    }

    // 5. Parallax for Background Text
    gsap.to('.hero-bg-text', {
        scrollTrigger: {
            trigger: '.collection-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 200,
        opacity: 0.05
    });

    // 6. Sticky Nav Effect
    ScrollTrigger.create({
        start: 'top -50',
        onEnter: () => gsap.to('.glass-nav', { backgroundColor: 'rgba(15, 15, 15, 0.9)', duration: 0.3 }),
        onLeaveBack: () => gsap.to('.glass-nav', { backgroundColor: 'rgba(15, 15, 15, 0.6)', duration: 0.3 }),
    });
});
