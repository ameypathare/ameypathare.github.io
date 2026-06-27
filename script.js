document.addEventListener('DOMContentLoaded', function () {
    // Horizontal infinite scroll carousel – 3D coverflow effect (circular motion)
    const horizontalSwiper = new Swiper('.horizontalSwiper', {
        effect: 'coverflow',
        slidesPerView: 'auto',
        centeredSlides: true,
        loop: true,
        speed: 3000, // autoplay scroll speed (3 seconds per slide)
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            reverseDirection: false, // left-to-right
        },
        coverflowEffect: {
            rotate: 30,
            stretch: 10,
            depth: 200,
            modifier: 1,
            slideShadows: false,
        },
        breakpoints: {
            0: { spaceBetween: 20 },
            768: { spaceBetween: 30 },
        },
        // NOTE: `navigation` is removed – we handle clicks manually below
    });

    // Pause on hover
    const swiperContainer = document.querySelector('.horizontalSwiper');
    if (swiperContainer) {
        swiperContainer.addEventListener('mouseenter', () => {
            horizontalSwiper.autoplay.stop();
        });
        swiperContainer.addEventListener('mouseleave', () => {
            horizontalSwiper.autoplay.start();
        });
    }

    // ===== CUSTOM FAST NAVIGATION BUTTONS =====
    const nextBtn = document.querySelector('.swiper-button-next');
    const prevBtn = document.querySelector('.swiper-button-prev');

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', function (e) {
            e.preventDefault();
            horizontalSwiper.slideNext(600); // fast slide (600ms)
        });

        prevBtn.addEventListener('click', function (e) {
            e.preventDefault();
            horizontalSwiper.slidePrev(600); // fast slide (600ms)
        });
    }

    // Fade-in animations for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section:not(.hero)').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // Typewriter effect in hero
    const text = "Data means little without insight. I bridge the gap between analytics and action turning numbers models and dashboards into clear business strategies. By blending data expertise with real-world operational needs I help companies move from reactive reporting to predictive decision-making that drives results. My approach goes beyond models and dashboards I ensure data works as a strategic asset — whether by identifying untapped revenue streams, preempting risks with predictive analytics or refining customer experiences through AI. The result? Decisions fueled not by intuition but by evidence, automation and scalable intelligence.";

    const outputElement = document.getElementById('typed-output');
    const heroImage = document.querySelector('.hero-image');

    if (outputElement) {
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                outputElement.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            }
        }
        typeWriter();
    }

    // "Get started" button animation
    const getStartedBtn = document.querySelector('.site-header .btn-primary');
    if (getStartedBtn) {
        let isScrolling = false;
        let animationFrame = null;

        const cancelScroll = (e) => {
            // Ignore if the interaction is clicking the button itself
            if (e && e.target && (e.target === getStartedBtn || getStartedBtn.contains(e.target))) {
                return;
            }
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
            isScrolling = false;
        };

        // Cancel if user interacts (wheel, touch, click, key)
        const interactions = ['wheel', 'touchstart', 'mousedown', 'keydown'];
        interactions.forEach(type => {
            window.addEventListener(type, cancelScroll, { passive: true });
        });

        getStartedBtn.addEventListener('click', function (e) {
            e.preventDefault();
            cancelScroll();

            // 1. INSTANTLY jump to top
            // behavior: 'instant' overrides CSS scroll-behavior: smooth
            window.scrollTo({ top: 0, behavior: 'instant' });
            // For older browsers
            if (window.scrollY !== 0) window.scrollTo(0, 0);

            // 2. Start slow scroll to bottom
            const startTime = performance.now();
            const startY = 0;
            const targetY = document.documentElement.scrollHeight - window.innerHeight;
            const duration = 12000; // 12 seconds for a slow, smooth scroll

            isScrolling = true;

            const step = (currentTime) => {
                if (!isScrolling) return;
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const currentY = startY + (targetY - startY) * progress;
                window.scrollTo(0, currentY);

                if (progress < 1) {
                    animationFrame = requestAnimationFrame(step);
                } else {
                    animationFrame = null;
                    isScrolling = false;
                }
            };

            // Small timeout to ensure the manual scroll has finished settling
            setTimeout(() => {
                animationFrame = requestAnimationFrame(step);
            }, 50);
        });
    }
});
