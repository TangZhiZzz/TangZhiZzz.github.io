// 趣味游戏页面专属脚本

// 游戏数据
const gameData = {
    'burger-maker': {
        name: '蟹黄堡制作大师',
        description: '制作完美的蟹黄堡',
        instructions: '按照顾客要求添加正确的配料制作蟹黄堡'
    },
    'jellyfish-catch': {
        name: '水母抓捕大冒险',
        description: '抓捕可爱的水母',
        instructions: '使用鼠标移动网子抓捕水母，避开危险的水母'
    },
    'memory-match': {
        name: '比奇堡记忆配对',
        description: '记忆力挑战游戏',
        instructions: '翻开卡片找到相同的角色配对'
    },
    'bubble-shooter': {
        name: '海底泡泡射击',
        description: '射击彩色泡泡',
        instructions: '射击相同颜色的泡泡来消除它们'
    },
    'jigsaw-puzzle': {
        name: '海绵宝宝拼图',
        description: '拼图挑战',
        instructions: '拖拽拼图块到正确位置完成图片'
    },
    'music-rhythm': {
        name: '比奇堡音乐节拍',
        description: '音乐节拍游戏',
        instructions: '跟着音乐节拍点击按钮'
    }
};

// 排行榜数据
const leaderboardData = {
    overall: [
        { rank: 1, name: '海绵宝宝', game: '蟹黄堡制作', score: 9850 },
        { rank: 2, name: '派大星', game: '水母抓捕', score: 8920 },
        { rank: 3, name: '章鱼哥', game: '音乐节拍', score: 8750 },
        { rank: 4, name: '蟹老板', game: '泡泡射击', score: 8650 },
        { rank: 5, name: '珊迪', game: '记忆配对', score: 8500 },
        { rank: 6, name: '小蜗', game: '拼图游戏', score: 8200 },
        { rank: 7, name: '痞老板', game: '蟹黄堡制作', score: 7980 },
        { rank: 8, name: '泡芙老师', game: '水母抓捕', score: 7850 }
    ],
    weekly: [
        { rank: 1, name: '海绵宝宝', game: '蟹黄堡制作', score: 9850 },
        { rank: 2, name: '珊迪', game: '记忆配对', score: 8900 },
        { rank: 3, name: '派大星', game: '泡泡射击', score: 8750 },
        { rank: 4, name: '章鱼哥', game: '音乐节拍', score: 8600 },
        { rank: 5, name: '蟹老板', game: '水母抓捕', score: 8400 }
    ],
    daily: [
        { rank: 1, name: '海绵宝宝', game: '蟹黄堡制作', score: 9850 },
        { rank: 2, name: '派大星', game: '水母抓捕', score: 8920 },
        { rank: 3, name: '珊迪', game: '拼图游戏', score: 8700 }
    ]
};

// 游戏统计数据
let gameStats = {
    gamesPlayed: 0,
    highScore: 0,
    achievements: 1
};

// 成就数据
const achievements = {
    'first-game': { unlocked: true, name: '初来乍到' },
    'burger-master': { unlocked: false, name: '蟹黄堡大师' },
    'jellyfish-hunter': { unlocked: false, name: '水母猎手' },
    'memory-master': { unlocked: false, name: '记忆大师' },
    'rhythm-expert': { unlocked: false, name: '节拍达人' },
    'all-rounder': { unlocked: false, name: '全能玩家' }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initGamesPage();
});

// 初始化游戏页面
function initGamesPage() {
    console.log('游戏页面初始化中...');
    
    // 加载游戏统计
    loadGameStats();
    
    // 初始化排行榜
    showLeaderboard('overall');
    
    // 初始化动画效果
    initScrollAnimations();
    
    // 初始化游戏卡片特效
    initGameCardEffects();
    
    console.log('游戏页面初始化完成');
}

// 加载游戏统计
function loadGameStats() {
    // 从本地存储加载统计数据
    const savedStats = localStorage.getItem('spongebob-game-stats');
    if (savedStats) {
        gameStats = JSON.parse(savedStats);
    }
    
    // 更新显示
    updateStatsDisplay();
}

// 更新统计显示
function updateStatsDisplay() {
    const gamesPlayedEl = document.getElementById('games-played');
    const highScoreEl = document.getElementById('high-score');
    const achievementsEl = document.getElementById('achievements');
    
    if (gamesPlayedEl) {
        animateNumber(gamesPlayedEl, 0, gameStats.gamesPlayed, 1000);
    }
    
    if (highScoreEl) {
        animateNumber(highScoreEl, 0, gameStats.highScore, 1500);
    }
    
    if (achievementsEl) {
        animateNumber(achievementsEl, 0, gameStats.achievements, 800);
    }
}

// 数字动画
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// 开始游戏
function startGame(gameId) {
    console.log(`启动游戏: ${gameId}`);
    
    const game = gameData[gameId];
    if (!game) {
        showMessage('游戏不存在！', 'error');
        return;
    }
    
    // 显示游戏模态框
    showGameModal(game);
    
    // 更新游戏统计
    gameStats.gamesPlayed++;
    
    // 模拟游戏分数
    const score = Math.floor(Math.random() * 10000) + 5000;
    if (score > gameStats.highScore) {
        gameStats.highScore = score;
    }
    
    // 保存统计数据
    saveGameStats();
    
    // 更新显示
    updateStatsDisplay();
    
    // 检查成就
    checkAchievements(gameId, score);
}

// 显示游戏模态框
function showGameModal(game) {
    const modal = document.getElementById('game-modal');
    const container = document.getElementById('game-container');
    
    if (!modal || !container) return;
    
    // 创建游戏占位内容
    container.innerHTML = `
        <div class="game-placeholder">
            <h3>${game.name}</h3>
            <p>${game.description}</p>
            <div style="margin: 2rem 0;">
                <p><strong>游戏说明：</strong></p>
                <p>${game.instructions}</p>
            </div>
            <div style="margin-top: 2rem;">
                <button class="btn btn-primary" onclick="simulateGameplay()" style="margin-right: 1rem;">开始游戏</button>
                <button class="btn btn-secondary" onclick="closeGame()">返回</button>
            </div>
            <div id="game-score" style="margin-top: 2rem; font-size: 1.5rem; color: #FFE135;"></div>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // 添加打开动画
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// 模拟游戏玩法
function simulateGameplay() {
    const scoreEl = document.getElementById('game-score');
    if (!scoreEl) return;
    
    scoreEl.innerHTML = '<p>游戏进行中...</p>';
    
    // 模拟游戏时间
    setTimeout(() => {
        const score = Math.floor(Math.random() * 10000) + 5000;
        scoreEl.innerHTML = `
            <p><strong>游戏结束！</strong></p>
            <p>得分: ${score.toLocaleString()}</p>
            <p>🎉 太棒了！</p>
        `;
        
        // 更新最高分
        if (score > gameStats.highScore) {
            gameStats.highScore = score;
            saveGameStats();
            updateStatsDisplay();
            showMessage('🎉 新的最高分！', 'success');
        }
    }, 3000);
}

// 关闭游戏
function closeGame() {
    const modal = document.getElementById('game-modal');
    if (!modal) return;
    
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// 显示排行榜
function showLeaderboard(type) {
    console.log(`显示排行榜: ${type}`);
    
    // 更新标签状态
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.includes(getTabText(type))) {
            tab.classList.add('active');
        }
    });
    
    // 获取排行榜数据
    const data = leaderboardData[type] || [];
    
    // 生成排行榜内容
    const content = document.getElementById('leaderboard-content');
    if (!content) return;
    
    if (data.length === 0) {
        content.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">暂无排行榜数据</p>';
        return;
    }
    
    content.innerHTML = data.map(item => `
        <div class="leaderboard-item">
            <div class="leaderboard-rank">${getRankIcon(item.rank)}${item.rank}</div>
            <div class="leaderboard-player">
                <h4>${item.name}</h4>
                <p>${item.game}</p>
            </div>
            <div class="leaderboard-score">${item.score.toLocaleString()}</div>
        </div>
    `).join('');
}

// 获取标签文本
function getTabText(type) {
    const texts = {
        overall: '总排行',
        weekly: '本周',
        daily: '今日'
    };
    return texts[type] || '总排行';
}

// 获取排名图标
function getRankIcon(rank) {
    const icons = {
        1: '🥇 ',
        2: '🥈 ',
        3: '🥉 '
    };
    return icons[rank] || '';
}

// 保存游戏统计
function saveGameStats() {
    localStorage.setItem('spongebob-game-stats', JSON.stringify(gameStats));
}

// 检查成就
function checkAchievements(gameId, score) {
    let newAchievements = [];
    
    // 检查各种成就条件
    if (gameId === 'burger-maker' && score >= 9000 && !achievements['burger-master'].unlocked) {
        achievements['burger-master'].unlocked = true;
        newAchievements.push('蟹黄堡大师');
        gameStats.achievements++;
    }
    
    if (gameId === 'music-rhythm' && score >= 9500 && !achievements['rhythm-expert'].unlocked) {
        achievements['rhythm-expert'].unlocked = true;
        newAchievements.push('节拍达人');
        gameStats.achievements++;
    }
    
    // 检查全能玩家成就
    const unlockedCount = Object.values(achievements).filter(a => a.unlocked).length;
    if (unlockedCount >= 5 && !achievements['all-rounder'].unlocked) {
        achievements['all-rounder'].unlocked = true;
        newAchievements.push('全能玩家');
        gameStats.achievements++;
    }
    
    // 显示新成就
    if (newAchievements.length > 0) {
        showAchievementNotification(newAchievements);
        updateAchievementDisplay();
        saveGameStats();
    }
}

// 显示成就通知
function showAchievementNotification(achievements) {
    achievements.forEach((achievement, index) => {
        setTimeout(() => {
            showMessage(`🏆 解锁成就: ${achievement}`, 'success');
        }, index * 1000);
    });
}

// 更新成就显示
function updateAchievementDisplay() {
    const achievementItems = document.querySelectorAll('.achievement-item');
    
    achievementItems.forEach((item, index) => {
        const achievementKeys = Object.keys(achievements);
        if (index < achievementKeys.length) {
            const key = achievementKeys[index];
            const achievement = achievements[key];
            
            if (achievement.unlocked) {
                item.classList.remove('locked');
                item.classList.add('unlocked');
                
                const status = item.querySelector('.achievement-status');
                if (status) {
                    status.textContent = '已解锁';
                }
            }
        }
    });
}

// 初始化游戏卡片特效
function initGameCardEffects() {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        // 鼠标进入效果
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        // 鼠标离开效果
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // 点击波纹效果
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('play-btn')) return;
            
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 225, 53, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
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
    const animatedElements = document.querySelectorAll('.game-card, .achievement-item, .leaderboard-container');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// 点击模态框外部关闭
document.addEventListener('click', function(e) {
    const modal = document.getElementById('game-modal');
    if (e.target === modal) {
        closeGame();
    }
});

// 添加波纹动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 导出游戏页面功能
window.GamesPage = {
    startGame,
    closeGame,
    showLeaderboard,
    gameStats,
    achievements
};

console.log('游戏页面脚本加载完成');