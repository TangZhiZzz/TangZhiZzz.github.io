// ========================================
// Matrix Rain + GSAP Animations
// ========================================

gsap.registerPlugin(ScrollTrigger);

// ========================================
// Matrix Rain Canvas
// ========================================
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrixCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.columns = [];
        this.fontSize = 14;
        this.columnWidth = this.fontSize;
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.init());
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        const columnCount = Math.floor(this.canvas.width / this.columnWidth);
        this.columns = [];
        
        for (let i = 0; i < columnCount; i++) {
            this.columns[i] = {
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 0.5 + 0.5,
                chars: []
            };
            
            // Initialize with random chars
            const charCount = Math.floor(Math.random() * 20) + 10;
            for (let j = 0; j < charCount; j++) {
                this.columns[i].chars.push(this.getRandomChar());
            }
        }
    }
    
    getRandomChar() {
        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz<>{}[];/.,';
        return chars[Math.floor(Math.random() * chars.length)];
    }
    
    draw() {
        // Semi-transparent black to create trail effect
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.font = `${this.fontSize}px JetBrains Mono, monospace`;
        
        for (let i = 0; i < this.columns.length; i++) {
            const column = this.columns[i];
            
            for (let j = 0; j < column.chars.length; j++) {
                const charY = column.y - (j * this.fontSize);
                
                if (charY > 0 && charY < this.canvas.height) {
                    // First char is brightest
                    if (j === 0) {
                        this.ctx.fillStyle = '#ffffff';
                    } else if (j < 5) {
                        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
                    } else if (j < 10) {
                        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.6)';
                    } else {
                        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
                    }
                    
                    this.ctx.fillText(
                        column.chars[j],
                        i * this.columnWidth,
                        charY
                    );
                }
            }
            
            // Update position
            column.y += this.fontSize * column.speed;
            
            // Randomly change some characters
            if (Math.random() < 0.02) {
                const randomIndex = Math.floor(Math.random() * column.chars.length);
                column.chars[randomIndex] = this.getRandomChar();
            }
            
            // Reset column if it's off screen
            if (column.y - (column.chars.length * this.fontSize) > this.canvas.height) {
                column.y = 0;
                column.speed = Math.random() * 0.5 + 0.5;
                const charCount = Math.floor(Math.random() * 20) + 10;
                column.chars = [];
                for (let j = 0; j < charCount; j++) {
                    column.chars.push(this.getRandomChar());
                }
            }
        }
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize Matrix Rain
const matrixRain = new MatrixRain();

// ========================================
// Hero Section - Typewriter Effect
// ========================================
const heroTerminal = document.getElementById('heroTerminal');
const infoJsonEl = document.getElementById('infoJson');

const infoJson = `{
  "name": "汤俊飞",
  "role": "中级/高级 .NET 开发工程师",
  "experience": "5年+",
  "expected_salary": "15-20K",
  "education": "唐山职业技术学院 | 计算机应用技术 | 2017-2020",
  "awards": ["蓝桥杯 C# 组省赛二等奖", "国家励志奖学金"],
  "skills": [
    "C#", ".NET Core", ".NET 5+", "ASP.NET",
    "WinForm", "Web API", "LINQ", "Async/Await",
    "SQL Server", "MySQL", "Redis", "RabbitMQ"
  ],
  "status": "<span class=\"keyword\">open_to_work</span>"
}`;

function typeWriter(element, text, speed = 30, callback) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            if (text.substring(i, i + 1) === '<') {
                // Handle HTML tags
                const closeTag = text.indexOf('>', i);
                element.innerHTML += text.substring(i, closeTag + 1);
                i = closeTag + 1;
            } else {
                element.innerHTML += text.charAt(i);
                i++;
            }
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    type();
}

// Animate hero terminal lines
const heroLines = heroTerminal.querySelectorAll('.terminal-line');

function animateHeroTerminal() {
    heroLines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('visible');
            line.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
            
            // When we reach the infoJson line, trigger typewriter
            if (line.classList.contains('output-block')) {
                setTimeout(() => {
                    typeWriter(infoJsonEl, infoJson, 15);
                }, 300);
            }
        }, index * 400);
    });
}

// ========================================
// About Section - Code Reveal
// ========================================
const aboutSection = document.getElementById('about');
const aboutLines = aboutSection.querySelectorAll('.code-line');

// ========================================
// Skills Section - Install Animation
// ========================================
const skillsSection = document.getElementById('skills');
const installLines = skillsSection.querySelectorAll('.installing');

// ========================================
// Projects - Card Reveal
// ========================================
const projectCards = document.querySelectorAll('.project-card');

// ========================================
// Timeline - Git Log Reveal
// ========================================
const timelineItems = document.querySelectorAll('.timeline-item');

// ========================================
// Contact Form Handler
// ========================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btn = contactForm.querySelector('.submit-btn');
    const originalText = btn.textContent;
    
    btn.textContent = '[SENDING...]';
    btn.disabled = true;
    
    // Simulate sending
    setTimeout(() => {
        btn.textContent = '[SENT!]';
        btn.style.borderColor = '#00ff00';
        btn.style.color = '#00ff00';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.style.borderColor = '';
            btn.style.color = '';
            contactForm.reset();
        }, 2000);
    }, 1500);
});

// ========================================
// Scroll Animations with GSAP
// ========================================

// Hero terminal animation on load
window.addEventListener('load', () => {
    setTimeout(animateHeroTerminal, 500);
});

// About section code reveal
ScrollTrigger.create({
    trigger: '#about',
    start: 'top 70%',
    onEnter: () => {
        aboutLines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('visible');
                line.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                line.style.opacity = '1';
                line.style.transform = 'translateX(0)';
            }, index * 50);
        });
    },
    once: true
});

// Skills install animation
ScrollTrigger.create({
    trigger: '#skills',
    start: 'top 70%',
    onEnter: () => {
        installLines.forEach((line, index) => {
            setTimeout(() => {
                const text = line.getAttribute('data-text');
                if (text) {
                    let i = 0;
                    line.textContent = '';
                    line.classList.add('visible');
                    
                    function typeChar() {
                        if (i < text.length) {
                            line.textContent += text.charAt(i);
                            i++;
                            setTimeout(typeChar, 30);
                        }
                    }
                    typeChar();
                }
            }, index * 400);
        });
    },
    once: true
});

// Project cards reveal
ScrollTrigger.create({
    trigger: '#projects',
    start: 'top 70%',
    onEnter: () => {
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease';
            }, index * 300);
        });
    },
    once: true
});

// Timeline items reveal
ScrollTrigger.create({
    trigger: '#timeline',
    start: 'top 70%',
    onEnter: () => {
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease';
            }, index * 400);
        });
    },
    once: true
});

// ========================================
// Navigation Highlight on Scroll
// ========================================
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = '#00ff00';
            link.style.textShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
        } else {
            link.style.color = '';
            link.style.textShadow = '';
        }
    });
});

// ========================================
// Smooth Scroll for Nav Links
// ========================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// Parallax Effect for Terminal Windows
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    document.querySelectorAll('.terminal-window').forEach((terminal, index) => {
        const speed = 0.05 * (index + 1);
        const yPos = scrolled * speed;
        terminal.style.transform = `translateY(${yPos}px)`;
    });
});

// ========================================
// Random Glitch Effect (Occasional)
// ========================================
function randomGlitch() {
    const terminals = document.querySelectorAll('.terminal-window');
    
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance
            const randomTerminal = terminals[Math.floor(Math.random() * terminals.length)];
            randomTerminal.style.animation = 'glitch 0.1s ease';
            
            setTimeout(() => {
                randomTerminal.style.animation = '';
            }, 100);
        }
    }, 5000);
}

randomGlitch();

// ========================================
// Console Easter Egg
// ========================================
console.log('%c╔══════════════════════════════════════════════╗', 'color: #00ff00');
console.log('%c║  Matrix Portfolio v1.0                       ║', 'color: #00ff00');
console.log('%c║  汤俊飞 | 中级/高级 .NET 开发工程师            ║', 'color: #00ff00');
console.log('%c║  5年+ 开发经验 | 期望薪资 15-20K              ║', 'color: #00ff00');
console.log('%c║  唐山职业技术学院 | 蓝桥杯C#组省赛二等奖       ║', 'color: #00cc00');
console.log('%c╚══════════════════════════════════════════════╝', 'color: #00ff00');
console.log('%c[Phone]  17631393397', 'color: #00cc00');
console.log('%c[Email]   tjfzeishuai@163.com', 'color: #00cc00');
console.log('%c[GitHub]  github.com/TangZhiZzz', 'color: #00cc00');

// ========================================
// Mobile Detection - Reduce Effects
// ========================================
const isMobile = window.innerWidth <= 768;

if (isMobile) {
    matrixRain.canvas.style.opacity = '0.05';
    document.querySelector('.scanlines').style.opacity = '0.1';
}

// ========================================
// Refresh on Resize
// ========================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
        matrixRain.init();
    }, 250);
});

// ========================================
// Initial Setup Complete
// ========================================
console.log('%c✅ Matrix Rain Initialized', 'color: #00ff00');
console.log('%c✅ GSAP ScrollTrigger Registered', 'color: #00ff00');
console.log('%c✅ All Systems Operational', 'color: #00ff00');
