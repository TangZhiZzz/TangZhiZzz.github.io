// ===== DOM 加载完成后执行 =====
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMobileMenu();
  initScrollReveal();
  initSkillBars();
  initStatCounters();
  initSmoothScroll();
});

// ===== 导航栏效果 =====
function initNav() {
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // 添加/移除背景
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
}

// ===== 移动端菜单 =====
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  const links = menu.querySelectorAll('.mobile-link');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });

  // 点击链接后关闭菜单
  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ===== 滚动显示动画 =====
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// ===== 技能条动画 =====
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progress = entry.target.dataset.progress;
        entry.target.style.width = `${progress}%`;
      }
    });
  }, {
    threshold: 0.5
  });

  skillBars.forEach(bar => observer.observe(bar));
}

// ===== 数字计数器动画 =====
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const updateCounter = () => {
    current += step;
    if (current < target) {
      element.textContent = Math.floor(current) + '+';
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target + '+';
    }
  };

  updateCounter();
}

// ===== 平滑滚动 =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ===== 头像加载失败处理 =====
document.addEventListener('DOMContentLoaded', () => {
  const avatar = document.getElementById('avatar');
  const placeholder = document.getElementById('avatarPlaceholder');
  
  if (avatar && placeholder) {
    avatar.addEventListener('error', () => {
      avatar.style.display = 'none';
      placeholder.style.display = 'flex';
    });
    
    // 如果图片加载成功，隐藏占位符
    avatar.addEventListener('load', () => {
      placeholder.style.display = 'none';
    });
  }
});
