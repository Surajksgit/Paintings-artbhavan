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
    const interactiveElements = document.querySelectorAll('a, button, .art-card-dashboard, select');
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
    const welcomeTitle = new SplitType('.welcome-msg', { types: 'words, chars' });

    tl.from('.glass-nav', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    })
        .from(welcomeTitle.chars, {
            y: 80,
            opacity: 0,
            stagger: 0.02,
            duration: 0.8,
            ease: 'expo.out'
        }, '-=0.5')
        .from('.welcome-subtitle', {
            y: 20,
            opacity: 0,
            duration: 0.6
        }, '-=0.6')
        .from('.stat-item', {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.4')
        .from('.control-panel', {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.6');

    // 4. Staggered Grid Reveal
    const artworks = document.querySelectorAll('.art-card-dashboard');
    if (artworks.length > 0) {
        // Fallback: Show after 2 seconds if animation hasn't happened
        const fallbackReveal = setTimeout(() => {
            gsap.to('.art-card-dashboard', {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out'
            });
        }, 2000);

        gsap.set('.art-card-dashboard', { opacity: 0, y: 30 });

        ScrollTrigger.batch('.art-card-dashboard', {
            onEnter: batch => {
                clearTimeout(fallbackReveal);
                gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: 'power3.out',
                    overwrite: true
                });
            },
            start: 'top 95%'
        });
    }

    // 5. Header Split-Text
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        const split = new SplitType(title, { types: 'chars' });
        gsap.from(split.chars, {
            scrollTrigger: {
                trigger: title,
                start: 'top 90%',
            },
            x: 20,
            opacity: 0,
            stagger: 0.05,
            duration: 0.8,
            ease: 'back.out(2)'
        });
    });

    // 6. Flash message auto-hide
    setTimeout(() => {
        const flashes = document.querySelectorAll('.flash-message');
        flashes.forEach(flash => {
            gsap.to(flash, {
                opacity: 0,
                x: 50,
                duration: 0.5,
                onComplete: () => flash.remove()
            });
        });
    }, 5000);

    // 7. Carousel Interaction
    const carouselItems = document.querySelectorAll('.carousel-item');
    carouselItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item.querySelector('img'), { scale: 1.1, duration: 2, ease: 'power1.out' });
        });
        item.addEventListener('mouseleave', () => {
            gsap.to(item.querySelector('img'), { scale: 1, duration: 2, ease: 'power1.out' });
        });
    });
});
