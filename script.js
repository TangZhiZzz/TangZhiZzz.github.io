// ==================== GSAP & ScrollTrigger Setup ====================
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// ==================== Theme Toggle ====================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// ==================== Mobile Menu ====================
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

navToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ==================== Navbar Scroll Effect ====================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ==================== Smooth Scroll ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 72;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ==================== Hero Animation ====================
const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

heroTimeline
  .to('#nameLine', {
    y: 0,
    opacity: 1,
    duration: 1.2,
    from: { y: 80, opacity: 0 }
  })
  .to('#subtitleLine', {
    y: 0,
    opacity: 1,
    duration: 0.8
  }, '-=0.6')
  .to('#descLine', {
    y: 0,
    opacity: 1,
    duration: 0.8
  }, '-=0.6')
  .to('#ctaLine', {
    y: 0,
    opacity: 1,
    duration: 0.8
  }, '-=0.4')
  .to('#statsLine', {
    y: 0,
    opacity: 1,
    duration: 0.8
  }, '-=0.4')
  .to('.scroll-indicator', {
    opacity: 1,
    duration: 0.6
  }, '-=0.2');

// Initially set elements off-screen
gsap.set(['#subtitleLine', '#descLine', '#ctaLine', '#statsLine'], { 
  y: 30, 
  opacity: 0 
});
gsap.set('#nameLine', { y: 80, opacity: 0 });

// Hero parallax on scroll
gsap.to('.hero-content', {
  y: -100,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1
  }
});

gsap.to('.hero-bg-glow', {
  scale: 1.2,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.5
  }
});

// ==================== Section Headers Animation ====================
document.querySelectorAll('.section-header').forEach(header => {
  gsap.from(header, {
    x: -50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: header,
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  });
});

// ==================== About Section Animation ====================
gsap.from('.about-heading', {
  y: 40,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.about-heading',
    start: 'top 80%'
  }
});

gsap.from('.about-text', {
  y: 30,
  opacity: 0,
  duration: 0.8,
  stagger: 0.2,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.about-text',
    start: 'top 80%'
  }
});

gsap.from('.highlight-item', {
  x: -40,
  opacity: 0,
  duration: 0.8,
  stagger: 0.15,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.about-highlights',
    start: 'top 80%'
  }
});

gsap.from('.education-card', {
  x: 60,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.education-card',
    start: 'top 80%'
  }
});

// ==================== Timeline Animation ====================
document.querySelectorAll('.timeline-item').forEach((item, index) => {
  gsap.to(item, {
    x: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: item,
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    delay: index * 0.1
  });
});

// Timeline content hover animation
document.querySelectorAll('.timeline-content').forEach(content => {
  content.addEventListener('mouseenter', () => {
    gsap.to(content.querySelector('.timeline-marker'), {
      scale: 1.3,
      duration: 0.3
    });
  });
  content.addEventListener('mouseleave', () => {
    gsap.to(content.querySelector('.timeline-marker'), {
      scale: 1,
      duration: 0.3
    });
  });
});

// ==================== Skills Animation ====================
document.querySelectorAll('.skill-category').forEach((category, index) => {
  gsap.to(category, {
    y: 0,
    opacity: 1,
    duration: 0.6,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: category,
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    delay: index * 0.1
  });
});

// Skill tags stagger animation
document.querySelectorAll('.skill-category').forEach(category => {
  const tags = category.querySelectorAll('.skill-tag');
  gsap.from(tags, {
    scale: 0.8,
    opacity: 0,
    duration: 0.4,
    stagger: 0.05,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: category,
      start: 'top 75%'
    }
  });
});

// Skills Chart Animation
document.querySelectorAll('.chart-fill').forEach(bar => {
  const width = bar.getAttribute('data-width');
  
  ScrollTrigger.create({
    trigger: bar,
    start: 'top 85%',
    onEnter: () => {
      gsap.to(bar, {
        width: width + '%',
        duration: 1.5,
        ease: 'power3.out'
      });
    }
  });
});

// ==================== Projects Animation ====================
document.querySelectorAll('.project-card').forEach((card, index) => {
  gsap.to(card, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: card,
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    delay: index * 0.15
  });
});

// Project cards hover effect with 3D tilt
document.querySelectorAll('.project-card').forEach(card => {
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
      duration: 0.3,
      ease: 'power2.out'
    });
  });
  
  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
});

// ==================== Contact Section Animation ====================
gsap.from('.contact-left', {
  x: -60,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.contact-left',
    start: 'top 80%'
  }
});

gsap.from('.resume-card', {
  x: 60,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.resume-card',
    start: 'top 80%'
  }
});

gsap.from('.contact-info-item', {
  x: -40,
  opacity: 0,
  duration: 0.6,
  stagger: 0.1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.contact-info',
    start: 'top 80%'
  }
});

// ==================== Stats Counter Animation ====================
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumbers = entry.target.querySelectorAll('.stat-number');
      statNumbers.forEach(stat => {
        const text = stat.textContent;
        const hasPercent = text.includes('%');
        const hasPlus = text.includes('+');
        const num = parseFloat(text.replace(/[^0-9.]/g, ''));
        
        if (!isNaN(num)) {
          gsap.from(stat, {
            textContent: 0,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate: function() {
              const current = Math.round(gsap.getProperty(stat, 'textContent'));
              let suffix = '';
              if (hasPercent) suffix = '%';
              if (hasPlus) suffix = '+';
              if (text.includes('.')) {
                stat.textContent = gsap.getProperty(stat, 'textContent').toFixed(1) + suffix;
              } else {
                stat.textContent = current + suffix;
              }
            }
          });
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ==================== Scroll Progress Indicator ====================
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

gsap.to(scrollProgress, {
  scaleX: 1,
  ease: 'none',
  scrollTrigger: {
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.3
  }
});

// Add scroll progress styles dynamically
const progressStyle = document.createElement('style');
progressStyle.textContent = `
  .scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--accent), var(--accent-light));
    transform-origin: left;
    z-index: 9999;
    transform: scaleX(0);
  }
`;
document.head.appendChild(progressStyle);

// ==================== Page Load Animation ====================
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// ==================== Reduce Motion Support ====================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
  gsap.globalTimeline.timeScale(0);
  ScrollTrigger.getAll().forEach(st => st.kill());
}

// ==================== Window Resize Handler ====================
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});
