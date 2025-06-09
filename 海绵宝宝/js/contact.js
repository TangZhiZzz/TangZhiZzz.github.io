// 联系我们页面专属脚本

// 表单验证规则
const validationRules = {
    name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[\u4e00-\u9fa5a-zA-Z\s]+$/,
        message: '姓名必须为2-50个字符，只能包含中文、英文和空格'
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: '请输入有效的邮箱地址'
    },
    phone: {
        required: false,
        pattern: /^[\d\s\-\+\(\)]+$/,
        message: '请输入有效的电话号码'
    },
    subject: {
        required: true,
        message: '请选择消息主题'
    },
    message: {
        required: true,
        minLength: 10,
        maxLength: 1000,
        message: '消息内容必须为10-1000个字符'
    },
    privacy: {
        required: true,
        message: '请同意隐私政策和服务条款'
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initContactPage();
});

// 初始化联系页面
function initContactPage() {
    console.log('联系页面初始化中...');
    
    // 初始化表单验证
    initFormValidation();
    
    // 初始化动画效果
    initScrollAnimations();
    
    // 初始化卡片特效
    initCardEffects();
    
    // 初始化社交媒体链接
    initSocialLinks();
    
    console.log('联系页面初始化完成');
}

// 初始化表单验证
function initFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    // 添加实时验证
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    // 表单提交处理
    form.addEventListener('submit', handleFormSubmit);
}

// 验证单个字段
function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const rules = validationRules[fieldName];
    
    if (!rules) return true;
    
    // 清除之前的错误
    clearFieldError(field);
    
    // 必填验证
    if (rules.required && !value) {
        if (field.type === 'checkbox' && !field.checked) {
            showFieldError(field, rules.message);
            return false;
        } else if (field.type !== 'checkbox' && !value) {
            showFieldError(field, `${getFieldLabel(field)}不能为空`);
            return false;
        }
    }
    
    // 如果字段为空且非必填，跳过其他验证
    if (!value && !rules.required) {
        return true;
    }
    
    // 长度验证
    if (rules.minLength && value.length < rules.minLength) {
        showFieldError(field, `${getFieldLabel(field)}至少需要${rules.minLength}个字符`);
        return false;
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
        showFieldError(field, `${getFieldLabel(field)}不能超过${rules.maxLength}个字符`);
        return false;
    }
    
    // 格式验证
    if (rules.pattern && !rules.pattern.test(value)) {
        showFieldError(field, rules.message);
        return false;
    }
    
    // 验证通过
    showFieldSuccess(field);
    return true;
}

// 显示字段错误
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    // 移除成功状态
    formGroup.classList.remove('success');
    formGroup.classList.add('error');
    
    // 添加错误消息
    let errorMsg = formGroup.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        formGroup.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
    
    // 添加错误样式
    field.style.borderColor = '#FF6B6B';
    field.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.1)';
}

// 显示字段成功
function showFieldSuccess(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    
    // 添加成功样式
    field.style.borderColor = '#28a745';
    field.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.1)';
}

// 清除字段错误
function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    formGroup.classList.remove('error', 'success');
    
    const errorMsg = formGroup.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
    
    // 重置样式
    field.style.borderColor = '';
    field.style.boxShadow = '';
}

// 获取字段标签
function getFieldLabel(field) {
    const label = field.closest('.form-group').querySelector('label');
    return label ? label.textContent.replace('*', '').trim() : field.name;
}

// 处理表单提交
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    let isValid = true;
    
    // 验证所有字段
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showMessage('请检查并修正表单中的错误', 'error');
        return;
    }
    
    // 显示提交中状态
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn-text">发送中...</span><span class="btn-icon">⏳</span>';
    submitBtn.disabled = true;
    
    // 模拟表单提交
    setTimeout(() => {
        // 重置按钮状态
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // 显示成功消息
        showMessage('消息发送成功！我们会尽快回复您。', 'success');
        
        // 重置表单
        form.reset();
        
        // 清除所有验证状态
        inputs.forEach(input => clearFieldError(input));
        
        // 保存联系记录
        saveContactRecord(formData);
        
    }, 2000);
}

// 保存联系记录
function saveContactRecord(formData) {
    const record = {
        timestamp: new Date().toISOString(),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        newsletter: formData.get('newsletter') === 'on'
    };
    
    // 保存到本地存储
    const contacts = JSON.parse(localStorage.getItem('spongebob-contacts') || '[]');
    contacts.push(record);
    
    // 只保留最近50条记录
    if (contacts.length > 50) {
        contacts.splice(0, contacts.length - 50);
    }
    
    localStorage.setItem('spongebob-contacts', JSON.stringify(contacts));
    
    console.log('联系记录已保存:', record);
}

// 切换FAQ项目
function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // 关闭所有其他FAQ项目
    document.querySelectorAll('.faq-item.active').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
        }
    });
    
    // 切换当前项目
    if (isActive) {
        faqItem.classList.remove('active');
    } else {
        faqItem.classList.add('active');
    }
}

// 打开在线客服
function openChat() {
    // 模拟打开客服聊天窗口
    showMessage('客服聊天功能即将上线，请暂时使用表单联系我们！', 'info');
    
    // 滚动到表单区域
    const formSection = document.querySelector('.contact-form-section');
    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// 初始化卡片特效
function initCardEffects() {
    const cards = document.querySelectorAll('.contact-card, .sidebar-card, .faq-item');
    
    cards.forEach(card => {
        // 鼠标进入效果
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        // 鼠标离开效果
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// 初始化社交媒体链接
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.dataset.platform;
            const platformNames = {
                facebook: 'Facebook',
                twitter: 'Twitter',
                instagram: 'Instagram',
                youtube: 'YouTube'
            };
            
            showMessage(`即将跳转到${platformNames[platform]}页面...`, 'info');
            
            // 模拟跳转延迟
            setTimeout(() => {
                console.log(`跳转到${platform}页面`);
            }, 1000);
        });
    });
}

// 初始化滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll(
        '.contact-card, .form-container, .sidebar-card, .faq-item, .map-container'
    );
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 添加表单验证样式
const style = document.createElement('style');
style.textContent = `
    .form-group.error input,
    .form-group.error select,
    .form-group.error textarea {
        border-color: #FF6B6B !important;
        box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1) !important;
    }
    
    .form-group.success input,
    .form-group.success select,
    .form-group.success textarea {
        border-color: #28a745 !important;
        box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1) !important;
    }
    
    .error-message {
        color: #FF6B6B;
        font-size: 0.85rem;
        margin-top: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }
    
    .error-message::before {
        content: '⚠️';
        font-size: 0.8rem;
    }
    
    .submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none !important;
    }
`;
document.head.appendChild(style);

// 导出联系页面功能
window.ContactPage = {
    toggleFAQ,
    openChat,
    validateField,
    handleFormSubmit
};

console.log('联系页面脚本加载完成');