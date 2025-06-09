// 角色介绍页面专属脚本

// 角色详细信息数据
const characterData = {
    spongebob: {
        name: '海绵宝宝 SpongeBob',
        role: '蟹堡王厨师',
        description: '海绵宝宝是一个乐观开朗的黄色海绵，住在比奇堡的菠萝屋里。他是蟹堡王餐厅的首席厨师，以制作美味的蟹黄堡而闻名。海绵宝宝总是充满活力和热情，用他的积极态度感染着周围的每一个人。',
        traits: ['乐观', '勤奋', '友善', '热情', '天真'],
        details: {
            '居住地': '菠萝屋',
            '职业': '蟹堡王厨师',
            '爱好': '制作蟹黄堡、吹泡泡、抓水母',
            '最好的朋友': '派大星',
            '宠物': '小蜗Gary'
        },
        stats: {
            '快乐指数': '100%',
            '厨艺水平': '大师级',
            '友善程度': '极高',
            '工作热情': '满分'
        }
    },
    patrick: {
        name: '派大星 Patrick',
        role: '海绵宝宝的好朋友',
        description: '派大星是一只粉红色的海星，住在石头下面。虽然有时候显得有点迟钝和懒惰，但他是海绵宝宝最忠实的朋友。派大星心地善良，总是愿意帮助朋友，即使有时候帮倒忙。',
        traits: ['忠诚', '单纯', '幽默', '懒惰', '善良'],
        details: {
            '居住地': '石头下',
            '职业': '无业（偶尔打工）',
            '爱好': '睡觉、看电视、和海绵宝宝玩耍',
            '最好的朋友': '海绵宝宝',
            '特长': '举重、吃东西'
        },
        stats: {
            '忠诚度': '100%',
            '智商': '较低',
            '幽默感': '很高',
            '睡眠时间': '20小时/天'
        }
    },
    squidward: {
        name: '章鱼哥 Squidward',
        role: '蟹堡王收银员',
        description: '章鱼哥是一只蓝色的章鱼，住在复活节岛雕像形状的房子里。他是蟹堡王的收银员，热爱艺术和音乐，梦想成为著名的艺术家。虽然经常被海绵宝宝的热情所困扰，但内心深处还是关心这个邻居的。',
        traits: ['艺术家', '严肃', '音乐爱好者', '易怒', '有才华'],
        details: {
            '居住地': '复活节岛雕像屋',
            '职业': '蟹堡王收银员',
            '爱好': '演奏单簧管、绘画、雕塑',
            '梦想': '成为著名艺术家',
            '乐器': '单簧管'
        },
        stats: {
            '艺术天赋': '很高',
            '耐心程度': '较低',
            '音乐水平': '自认为很高',
            '工作积极性': '一般'
        }
    },
    krabs: {
        name: '蟹老板 Mr. Krabs',
        role: '蟹堡王老板',
        description: '蟹老板是一只红色的螃蟹，蟹堡王餐厅的老板和创始人。他非常爱钱，总是想方设法赚更多的钱，但同时也很关心自己的员工和女儿珍珍。他是一个精明的商人，有着丰富的人生阅历。',
        traits: ['商人', '精明', '父亲', '爱钱', '经验丰富'],
        details: {
            '居住地': '船锚屋',
            '职业': '蟹堡王老板',
            '爱好': '数钱、赚钱、照顾女儿',
            '女儿': '珍珍（鲸鱼）',
            '座右铭': '时间就是金钱'
        },
        stats: {
            '商业头脑': '极高',
            '赚钱能力': '大师级',
            '父爱程度': '很高',
            '节俭程度': '极高'
        }
    }
};

// 测试题目数据
const quizQuestions = [
    {
        question: '你最喜欢的活动是什么？',
        options: [
            { text: '工作和制作美食', character: 'spongebob' },
            { text: '睡觉和放松', character: 'patrick' },
            { text: '创作艺术作品', character: 'squidward' },
            { text: '赚钱和做生意', character: 'krabs' }
        ]
    },
    {
        question: '面对困难时，你会怎么做？',
        options: [
            { text: '保持乐观，积极解决', character: 'spongebob' },
            { text: '找朋友帮忙', character: 'patrick' },
            { text: '独自思考解决方案', character: 'squidward' },
            { text: '寻找最经济的解决方法', character: 'krabs' }
        ]
    },
    {
        question: '你的理想周末是什么样的？',
        options: [
            { text: '和朋友一起冒险', character: 'spongebob' },
            { text: '在家里什么都不做', character: 'patrick' },
            { text: '安静地练习艺术', character: 'squidward' },
            { text: '计划下周的工作', character: 'krabs' }
        ]
    }
];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化角色页面特效
    initCharacterEffects();
    
    // 初始化角色卡片动画
    initCharacterAnimations();
});

// 初始化角色页面特效
function initCharacterEffects() {
    console.log('角色页面已加载');
    
    // 为角色卡片添加随机颜色效果
    const characterCards = document.querySelectorAll('.character-card');
    characterCards.forEach((card, index) => {
        const colors = ['#FFD700', '#FF6B35', '#87CEEB', '#98FB98', '#DDA0DD'];
        const randomColor = colors[index % colors.length];
        
        card.addEventListener('mouseenter', function() {
            this.style.borderColor = randomColor;
            this.style.boxShadow = `0 15px 40px ${randomColor}40`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderColor = '#FFD700';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
        });
    });
    
    // 为配角卡片添加悬停效果
    const supportingCards = document.querySelectorAll('.supporting-card');
    supportingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const placeholder = this.querySelector('.placeholder');
            if (placeholder) {
                placeholder.style.transform = 'scale(1.2) rotate(10deg)';
                placeholder.style.borderColor = SpongeBobUtils.getSpongeBobColor();
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const placeholder = this.querySelector('.placeholder');
            if (placeholder) {
                placeholder.style.transform = 'scale(1) rotate(0deg)';
                placeholder.style.borderColor = '#87CEEB';
            }
        });
    });
}

// 初始化角色卡片动画
function initCharacterAnimations() {
    // 创建交叉观察器
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 200);
            }
        });
    }, observerOptions);
    
    // 观察角色卡片
    const characterCards = document.querySelectorAll('.character-card, .supporting-card');
    characterCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
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

// 显示角色详情
function showCharacterDetails(characterId) {
    const character = characterData[characterId];
    if (!character) return;
    
    const modal = document.getElementById('character-modal');
    const modalBody = document.getElementById('modal-body');
    
    // 生成模态框内容
    modalBody.innerHTML = `
        <div class="modal-character-info">
            <img src="img/a1.jpg" alt="${character.name}" class="placeholder">
            <h3>${character.name}</h3>
            <p class="character-role">${character.role}</p>
            <div class="character-traits">
                ${character.traits.map(trait => `<span class="trait">${trait}</span>`).join('')}
            </div>
        </div>
        
        <div class="character-details">
            <h4>角色介绍</h4>
            <p>${character.description}</p>
            
            <h4>基本信息</h4>
            ${Object.entries(character.details).map(([key, value]) => 
                `<p><strong>${key}:</strong> ${value}</p>`
            ).join('')}
            
            <h4>角色数据</h4>
            <div class="character-stats">
                ${Object.entries(character.stats).map(([key, value]) => 
                    `<div class="stat-item">
                        <div class="stat-label">${key}</div>
                        <div class="stat-value">${value}</div>
                    </div>`
                ).join('')}
            </div>
        </div>
    `;
    
    // 显示模态框
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // 记录查看行为
    console.log(`用户查看了角色: ${character.name}`);
    SpongeBobUtils.showMessage(`正在加载 ${character.name} 的详细信息...`, 'info');
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('character-modal');
    
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// 开始角色测试
function startQuiz() {
    SpongeBobUtils.showMessage('角色测试即将开始！', 'info');
    
    // 创建测试界面
    const quizModal = createQuizModal();
    document.body.appendChild(quizModal);
    
    // 显示第一个问题
    showQuizQuestion(0, {});
}

// 创建测试模态框
function createQuizModal() {
    const modal = document.createElement('div');
    modal.id = 'quiz-modal';
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeQuizModal()">&times;</span>
            <div id="quiz-body">
                <!-- 测试内容将在这里显示 -->
            </div>
        </div>
    `;
    
    // 添加显示动画
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    return modal;
}

// 显示测试问题
function showQuizQuestion(questionIndex, answers) {
    const quizBody = document.getElementById('quiz-body');
    
    if (questionIndex >= quizQuestions.length) {
        // 显示结果
        showQuizResult(answers);
        return;
    }
    
    const question = quizQuestions[questionIndex];
    
    quizBody.innerHTML = `
        <div class="quiz-question">
            <h3>问题 ${questionIndex + 1}/${quizQuestions.length}</h3>
            <p class="question-text">${question.question}</p>
            <div class="quiz-options">
                ${question.options.map((option, index) => 
                    `<button class="btn quiz-option" onclick="selectAnswer(${questionIndex}, '${option.character}')">
                        ${option.text}
                    </button>`
                ).join('')}
            </div>
        </div>
    `;
}

// 选择答案
function selectAnswer(questionIndex, character) {
    // 记录答案
    if (!window.quizAnswers) {
        window.quizAnswers = {};
    }
    
    if (!window.quizAnswers[character]) {
        window.quizAnswers[character] = 0;
    }
    window.quizAnswers[character]++;
    
    // 显示下一个问题
    showQuizQuestion(questionIndex + 1, window.quizAnswers);
}

// 显示测试结果
function showQuizResult(answers) {
    // 找出得分最高的角色
    let maxScore = 0;
    let resultCharacter = 'spongebob';
    
    for (const [character, score] of Object.entries(answers)) {
        if (score > maxScore) {
            maxScore = score;
            resultCharacter = character;
        }
    }
    
    const character = characterData[resultCharacter];
    const quizBody = document.getElementById('quiz-body');
    
    quizBody.innerHTML = `
        <div class="quiz-result">
            <h3>测试结果</h3>
            <div class="result-character">
                <img src="img/11a655e7f466423c7741d82445e7f554.jpg" alt="${character.name}" class="placeholder" style="width: 150px; height: 150px; border-radius: 50%; margin: 20px auto; display: block;">
                <h4>你最像：${character.name}</h4>
                <p class="character-role">${character.role}</p>
                <p>${character.description}</p>
                <div class="character-traits">
                    ${character.traits.map(trait => `<span class="trait">${trait}</span>`).join('')}
                </div>
            </div>
            <div class="result-actions">
                <button class="btn" onclick="restartQuiz()">重新测试</button>
                <button class="btn btn-primary" onclick="closeQuizModal()">完成</button>
            </div>
        </div>
    `;
    
    SpongeBobUtils.showMessage(`测试完成！你最像 ${character.name}`, 'success');
}

// 重新开始测试
function restartQuiz() {
    window.quizAnswers = {};
    showQuizQuestion(0, {});
}

// 关闭测试模态框
function closeQuizModal() {
    const quizModal = document.getElementById('quiz-modal');
    if (quizModal) {
        quizModal.classList.remove('show');
        setTimeout(() => {
            quizModal.remove();
        }, 300);
    }
    window.quizAnswers = {};
}

// 点击模态框外部关闭
window.addEventListener('click', function(event) {
    const characterModal = document.getElementById('character-modal');
    const quizModal = document.getElementById('quiz-modal');
    
    if (event.target === characterModal) {
        closeModal();
    }
    
    if (event.target === quizModal) {
        closeQuizModal();
    }
});

// 导出角色页面功能
window.CharactersPage = {
    showCharacterDetails,
    closeModal,
    startQuiz,
    characterData
};