// 首页专属脚本

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化首页特效
    initIndexEffects();
    
    // 初始化轮播动画
    initHeroAnimation();
    
    // 初始化计数器动画
    initCounterAnimation();
    
    // 初始化滚动动画
    initScrollAnimations();
});

// 初始化首页特效
function initIndexEffects() {
    console.log('首页特效已加载');
    
    // 为特色卡片添加随机颜色边框
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        const colors = ['#FFD700', '#FF6B35', '#87CEEB', '#98FB98'];
        const randomColor = colors[index % colors.length];
        
        card.addEventListener('mouseenter', function() {
            this.style.borderColor = randomColor;
            this.style.boxShadow = `0 15px 35px ${randomColor}30`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderColor = '#FFD700';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
        });
    });
    
    // 为快速链接添加点击统计
    const quickLinks = document.querySelectorAll('.quick-link');
    quickLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const linkName = this.querySelector('h3').textContent;
            console.log(`用户点击了快速链接: ${linkName}`);
            
            // 显示点击反馈
            SpongeBobUtils.showMessage(`正在前往 ${linkName}...`, 'info');
        });
    });
}

// 初始化英雄区域动画
function initHeroAnimation() {
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image img');
    
    if (heroImage) {
        // 添加图片悬停动画
        heroImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        heroImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
        
        // 添加定期摇摆动画
        setInterval(() => {
            if (!heroImage.matches(':hover')) {
                heroImage.style.transform = 'scale(1.05) rotate(2deg)';
                setTimeout(() => {
                    heroImage.style.transform = 'scale(1) rotate(0deg)';
                }, 500);
            }
        }, 3000);
    }
    
    // 为英雄按钮添加特殊效果
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 添加点击动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                // 模拟页面跳转
                const href = this.getAttribute('href');
                SpongeBobUtils.showMessage('页面即将跳转...', 'success');
                setTimeout(() => {
                    window.location.href = href;
                }, 1000);
            }, 150);
        });
    });
}

// 初始化计数器动画
function initCounterAnimation() {
    // 创建一个虚拟的统计数据显示
    const statsData = [
        { label: '快乐时光', value: 1000, suffix: '+' },
        { label: '精彩剧集', value: 250, suffix: '集' },
        { label: '忠实粉丝', value: 50000, suffix: '+' }
    ];
    
    // 可以在未来添加统计数据展示区域
    console.log('统计数据:', statsData);
}

// 初始化滚动动画
function initScrollAnimations() {
    // 创建交叉观察器来触发滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // 观察所有卡片元素
    const animatedElements = document.querySelectorAll('.card, .feature-card, .news-item, .quick-link');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// 添加页面特殊交互
function addSpecialInteractions() {
    // 添加彩蛋：连续点击logo触发特殊效果
    const logo = document.querySelector('.logo');
    let clickCount = 0;
    let clickTimer;
    
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            clickCount++;
            
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                if (clickCount >= 5) {
                    triggerEasterEgg();
                }
                clickCount = 0;
            }, 2000);
        });
    }
}

// 彩蛋效果
function triggerEasterEgg() {
    SpongeBobUtils.showMessage('🎉 你发现了海绵宝宝的秘密！', 'success');
    
    // 创建彩色泡泡效果
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createBubble();
        }, i * 100);
    }
}

// 创建泡泡效果
function createBubble() {
    const bubble = document.createElement('div');
    const size = Math.random() * 30 + 10;
    const color = SpongeBobUtils.getSpongeBobColor();
    
    bubble.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        opacity: 0.7;
        pointer-events: none;
        z-index: 9999;
        left: ${Math.random() * window.innerWidth}px;
        top: ${window.innerHeight}px;
        animation: bubbleFloat 3s ease-out forwards;
    `;
    
    // 添加泡泡动画
    if (!document.querySelector('#bubble-style')) {
        const style = document.createElement('style');
        style.id = 'bubble-style';
        style.textContent = `
            @keyframes bubbleFloat {
                to {
                    transform: translateY(-${window.innerHeight + 100}px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(bubble);
    
    setTimeout(() => {
        bubble.remove();
    }, 3000);
}

// 初始化特殊交互
addSpecialInteractions();

// 导出首页特有功能
window.IndexPage = {
    triggerEasterEgg,
    createBubble
};