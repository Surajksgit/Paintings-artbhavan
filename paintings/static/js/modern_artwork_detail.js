document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // 1. Custom Cursor
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

    const interactives = document.querySelectorAll('a, button, .thumb-item');
    interactives.forEach(el => {
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

    // 2. Entrance Animations
    const tl = gsap.timeline();
    const title = new SplitType('.artwork-title', { types: 'words, chars' });

    tl.from('.glass-nav', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    })
        .from('.main-image-wrapper', {
            x: -50,
            opacity: 0,
            duration: 1.5,
            ease: 'expo.out'
        }, '-=0.5')
        .from('.category-tag', {
            y: 20,
            opacity: 0,
            duration: 0.8
        }, '-=1')
        .from(title.chars, {
            y: 50,
            opacity: 0,
            stagger: 0.02,
            duration: 0.8,
            ease: 'expo.out'
        }, '-=0.8')
        .from('.price-box, .artwork-description, .spec-grid, .purchase-controls', {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.5');

    // 3. Image Gallery Logic
    window.changeImage = function (src, el) {
        const mainImg = document.getElementById('mainArtworkImage');

        // GSAP transition
        gsap.to(mainImg, {
            opacity: 0,
            scale: 0.95,
            duration: 0.4,
            onComplete: () => {
                mainImg.src = src;
                gsap.to(mainImg, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: 'expo.out'
                });
            }
        });

        // Update active thumb
        document.querySelectorAll('.thumb-item').forEach(thumb => {
            thumb.classList.remove('active');
        });
        el.classList.add('active');
    };

    // 4. Quantity Controls
    window.updateQty = function (val) {
        const input = document.getElementById('quantity');
        let current = parseInt(input.value);
        if (current + val >= 1) {
            input.value = current + val;

            // Subtle pop animation
            gsap.fromTo(input,
                { scale: 1.2 },
                { scale: 1, duration: 0.3, ease: 'back.out(2)' }
            );
        }
    };

    // 5. Parallax Effect on Main Image
    const visualWrapper = document.querySelector('.main-image-wrapper');
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX - window.innerWidth / 2) / 60;
        const y = (e.clientY - window.innerHeight / 2) / 60;

        gsap.to(visualWrapper, {
            rotationY: x,
            rotationX: -y,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
});
