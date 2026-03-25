// ========================================
// GSAP & ScrollTrigger Setup
// ========================================
gsap.registerPlugin(ScrollTrigger);

// Mobile Detection
const isMobile = window.innerWidth <= 1024;
const isSmallMobile = window.innerWidth <= 640;

// Reduce particle count on mobile
const PARTICLE_COUNT = isMobile ? 30 : 80;

// Enable ease overrides
const easeDefaults = {
    power1: 'power1.out',
    power2: 'power2.out',
    power3: 'power3.out',
    back: 'back.out(1.7)',
    elastic: 'elastic.out(1, 0.5)',
    bounce: 'bounce.out',
    slow: 'slow(0.3, 0.7, false)'
};

// ========================================
// Custom Cursor (Desktop Only)
// ========================================
if (!isMobile) {
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor animation
    function animateCursor() {
        cursorX = mouseX;
        cursorY = mouseY;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .btn, .nav-link, .project-card, .skill-tag, .contact-link').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
}

// ========================================
// Ripple Effect
// ========================================
const ripple = document.getElementById('ripple');

document.addEventListener('click', (e) => {
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    ripple.style.width = '0';
    ripple.style.height = '0';
    ripple.style.opacity = '1';

    gsap.to(ripple, {
        width: '200px',
        height: '200px',
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    });
});

// ========================================
// Particles Background
// ========================================
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '#00f2ff' : '#0066ff';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Parallax effect based on mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        this.x -= dx * 0.001;
        this.y -= dy * 0.001;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Create particles
for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connections
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                ctx.beginPath();
                ctx.strokeStyle = '#00f2ff';
                ctx.globalAlpha = 0.1 * (1 - dist / 150);
                ctx.lineWidth = 0.5;
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        });
    });

    animationId = requestAnimationFrame(animateParticles);
}
animateParticles();

// ========================================
// Navigation
// ========================================
const navbar = document.getElementById('navbar');
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

// Scroll effect
ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
        if (self.progress > 0) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: { y: target, offsetY: 80 },
                ease: 'power3.inOut'
            });
        }
    });
});

// ========================================
// Hero Section Animations
// ========================================
const heroTl = gsap.timeline({ delay: 0.3 });

// Characters animation
const chars = document.querySelectorAll('.char');
chars.forEach((char, i) => {
    gsap.set(char, { opacity: 0, y: 100, rotateX: -90 });
});

heroTl.to(chars, {
    opacity: 1,
    y: 0,
    rotateX: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'back.out(1.7)'
});

// Badge
heroTl.from('.hero-badge', {
    opacity: 0,
    y: 20,
    scale: 0.8,
    duration: 0.6,
    ease: 'back.out'
}, '-=0.4');

// Subtitle with blur
heroTl.to('.subtitle-line', {
    opacity: 1,
    filter: 'blur(0px)',
    duration: 0.8,
    ease: 'power2.out'
}, '-=0.3');

// Description
heroTl.to('.hero-desc', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out'
}, '-=0.4');

// CTA buttons
heroTl.to('.hero-cta', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'back.out'
}, '-=0.3');

// Scroll indicator
heroTl.to('.hero-scroll', {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out'
}, '-=0.2');

// Code window
heroTl.to('.code-window', {
    opacity: 1,
    rotateY: 0,
    duration: 1,
    ease: 'power3.out'
}, 0.2);

// ========================================
// Hero Parallax
// ========================================
gsap.to('.hero-bg-grid', {
    y: 100,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    }
});

gsap.to('.hero-visual', {
    y: -50,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    }
});

// ========================================
// About Section
// ========================================
const aboutTl = gsap.timeline({
    scrollTrigger: {
        trigger: '.about',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    }
});

aboutTl.from('.about-image', {
    opacity: 0,
    scale: 0.8,
    rotate: -10,
    duration: 1,
    ease: 'power3.out'
});

aboutTl.from('.about-title', {
    opacity: 0,
    x: -50,
    duration: 0.8,
    ease: 'power2.out'
}, '-=0.5');

aboutTl.from('.about-desc', {
    opacity: 0,
    x: -30,
    duration: 0.6,
    stagger: 0.2,
    ease: 'power2.out'
}, '-=0.4');

// Stats counter animation
const statNumbers = document.querySelectorAll('.stat-number');
statNumbers.forEach(stat => {
    const target = parseInt(stat.dataset.count);

    gsap.to(stat, {
        innerText: target,
        duration: 2,
        snap: { innerText: 1 },
        ease: 'power1.out',
        scrollTrigger: {
            trigger: stat,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        onUpdate: function() {
            stat.innerText = Math.round(this.targets()[0].innerText);
        }
    });
});

aboutTl.from('.stat-item', {
    opacity: 0,
    y: 30,
    stagger: 0.15,
    duration: 0.6,
    ease: 'back.out'
}, '-=0.3');

// ========================================
// Skills Section
// ========================================
const skillCategories = document.querySelectorAll('.skill-category');

skillCategories.forEach((category, index) => {
    gsap.to(category, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: index * 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: category,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Skill tags stagger animation
const skillTags = document.querySelectorAll('.skill-tag');
skillTags.forEach((tag, index) => {
    gsap.to(tag, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: 'back.out(2)',
        scrollTrigger: {
            trigger: tag,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });
});

// SVG path draw animation (skip on mobile)
if (!isMobile) {
    gsap.to('#skillPath', {
        strokeDashoffset: 0,
        duration: 3,
        ease: 'power2.inOut',
        scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        }
    });
}

// ========================================
// Projects Section
// ========================================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach((card, index) => {
    gsap.to(card, {
        opacity: 1,
        y: index === 1 ? 50 : 0,
        duration: 0.8,
        delay: index * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Card icon micro-animations
projectCards.forEach(card => {
    const icon = card.querySelector('.card-icon');

    card.addEventListener('mouseenter', () => {
        gsap.to(icon, {
            scale: 1.1,
            rotation: 5,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// ========================================
// Timeline Section
// ========================================
// SVG line draw animation (skip on mobile)
if (!isMobile) {
    gsap.to('.timeline-svg-line', {
        strokeDashoffset: 0,
        duration: 2,
        ease: 'power2.inOut',
        scrollTrigger: {
            trigger: '.timeline-wrapper',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        }
    });
}

// Timeline items
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineDots = document.querySelectorAll('.timeline-dot');

timelineItems.forEach((item, index) => {
    gsap.to(item, {
        opacity: 1,
        x: index === 1 ? -50 : 50,
        duration: 0.8,
        delay: index * 0.3,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: item,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Timeline dots
timelineDots.forEach((dot, index) => {
    gsap.to(dot, {
        scale: 1,
        duration: 0.4,
        delay: index * 0.3 + 0.5,
        ease: 'back.out(3)',
        scrollTrigger: {
            trigger: dot,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
});

// ========================================
// Contact Section
// ========================================
const contactTl = gsap.timeline({
    scrollTrigger: {
        trigger: '.contact',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    }
});

contactTl.from('.contact-title', {
    opacity: 0,
    y: 30,
    duration: 0.6,
    ease: 'power2.out'
});

contactTl.from('.contact-desc', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power2.out'
}, '-=0.3');

contactTl.from('.contact-link', {
    opacity: 0,
    x: -40,
    stagger: 0.15,
    duration: 0.6,
    ease: 'power3.out'
}, '-=0.3');

contactTl.from('.form-card', {
    opacity: 0,
    y: 50,
    rotateY: -15,
    duration: 1,
    ease: 'power3.out'
}, '-=0.5');

// ========================================
// Magnetic Effect
// ========================================
const magneticElements = document.querySelectorAll('.magnetic');

magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(el, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    el.addEventListener('mouseleave', () => {
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
        });
    });
});

// ========================================
// Section Transitions
// ========================================
document.querySelectorAll('.section').forEach(section => {
    gsap.from(section.querySelector('.section-header'), {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        }
    });
});

// ========================================
// Button Hover Effects
// ========================================
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            scale: 1.05,
            boxShadow: '0 10px 40px rgba(0, 242, 255, 0.3)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            scale: 1,
            boxShadow: '0 4px 20px rgba(0, 242, 255, 0.1)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// ========================================
// Form Interactions
// ========================================
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        gsap.to(input, {
            borderColor: '#00f2ff',
            boxShadow: '0 0 0 3px rgba(0, 242, 255, 0.1)',
            duration: 0.2,
            ease: 'power2.out'
        });
    });

    input.addEventListener('blur', () => {
        gsap.to(input, {
            borderColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: 'none',
            duration: 0.2,
            ease: 'power2.out'
        });
    });
});

// Form submission
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = e.target.querySelector('.btn-submit');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<span>发送中...</span>';
    btn.disabled = true;

    // Simulate sending
    setTimeout(() => {
        btn.innerHTML = '<span>发送成功!</span>';

        gsap.to(btn, {
            backgroundColor: '#00ff88',
            duration: 0.3
        });

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            gsap.to(btn, {
                backgroundColor: '',
                duration: 0.3
            });
            e.target.reset();
        }, 2000);
    }, 1500);
});

// ========================================
// 3D Card Effect
// ========================================
projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 1000,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
        });
    });
});

// ========================================
// Scroll Progress Indicator
// ========================================
gsap.to('.scroll-indicator', {
    scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
            const scrollLine = document.querySelector('.scroll-line');
            if (scrollLine) {
                gsap.to(scrollLine, {
                    scaleY: 0.5 + self.progress * 0.5,
                    duration: 0.1
                });
            }
        }
    }
});

// ========================================
// Section Background Parallax
// ========================================
document.querySelectorAll('.section-bg').forEach(bg => {
    gsap.to(bg, {
        y: -50,
        ease: 'none',
        scrollTrigger: {
            trigger: bg.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        }
    });
});

// ========================================
// Logo Animation
// ========================================
gsap.from('.nav-logo', {
    opacity: 0,
    scale: 0,
    rotate: -180,
    duration: 1,
    delay: 0.5,
    ease: 'elastic.out(1, 0.5)'
});

// ========================================
// Page Load Animation
// ========================================
gsap.from('body', {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out'
});

// ========================================
// Nav Links Animation
// ========================================
gsap.from('.nav-links li', {
    opacity: 0,
    y: -20,
    stagger: 0.1,
    duration: 0.5,
    delay: 0.8,
    ease: 'power2.out'
});

// ========================================
// Refresh ScrollTrigger on resize
// ========================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

// ========================================
// Cleanup on page unload
// ========================================
window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationId);
    ScrollTrigger.killAll();
});

// ========================================
// Console Easter Egg
// ========================================
console.log('%c🚀 汤俊飞 - .NET 开发工程师', 'font-size: 24px; font-weight: bold; color: #00f2ff;');
console.log('%c欢迎来访！联系方式: tjfzeishuai@163.com', 'font-size: 14px; color: #888;');
