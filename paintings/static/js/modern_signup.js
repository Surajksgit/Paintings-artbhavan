document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial GSAP Setup
    gsap.registerPlugin(ScrollTrigger);

    // 2. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');

    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 991) {
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
        }
    });

    // Cursor hover effects
    const interactiveElements = document.querySelectorAll('a, button, .input-modern');
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
    const title = new SplitType('.signup-title', { types: 'words, chars' });

    // Ensure elements are visible before animating
    gsap.set('.signup-card, .signup-title, .signup-subtitle, .form-group-modern, .btn-premium', {
        visibility: 'visible',
        opacity: 1
    });

    tl.from('.glass-nav', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    })
        .from('.signup-card', {
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: 'expo.out'
        }, '-=0.5')
        .from(title.chars, {
            y: 50,
            opacity: 0,
            stagger: 0.03,
            duration: 0.8,
            ease: 'expo.out'
        }, '-=1')
        .from('.signup-subtitle', {
            y: 10,
            opacity: 0,
            duration: 0.6
        }, '-=0.6')
        .from('.form-group-modern, .btn-premium, .divider, .social-login-group, .login-redirect', {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power2.out',
            clearProps: 'all'
        }, '-=0.5');

    // 4. Parallax effect for card on mouse move
    const card = document.querySelector('.signup-card');
    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 991) {
            const x = (e.clientX - window.innerWidth / 2) / 60;
            const y = (e.clientY - window.innerHeight / 2) / 60;

            gsap.to(card, {
                rotationY: x,
                rotationX: -y,
                duration: 0.6,
                ease: 'power2.out'
            });
        }
    });

    // 5. Input Field Parallax (Subtle)
    const inputs = document.querySelectorAll('.input-modern');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                x: 5,
                borderColor: '#f39c12',
                duration: 0.3
            });
        });
        input.addEventListener('blur', () => {
            gsap.to(input, {
                x: 0,
                borderColor: 'rgba(255, 255, 255, 0.08)',
                duration: 0.3
            });
        });
    });
});
