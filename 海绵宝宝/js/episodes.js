// 精彩剧集页面专属脚本

// 剧集数据
const episodesData = [
    {
        id: 'help-wanted',
        title: '帮助通缉犯',
        season: 1,
        episode: 1,
        type: 'comedy',
        rating: 9.5,
        description: '海绵宝宝第一次来到蟹堡王餐厅应聘厨师工作，开始了他在比奇堡的全新生活。',
        duration: '11:30',
        airDate: '1999-05-01'
    },
    {
        id: 'band-geeks',
        title: '乐队极客',
        season: 2,
        episode: 15,
        type: 'comedy',
        rating: 9.8,
        description: '章鱼哥组建乐队参加超级碗中场表演，海绵宝宝和朋友们加入其中。',
        duration: '11:15',
        airDate: '2001-09-07'
    },
    {
        id: 'chocolate-lady',
        title: '巧克力女士',
        season: 1,
        episode: 12,
        type: 'comedy',
        rating: 9.2,
        description: '海绵宝宝和派大星遇到了疯狂的巧克力女士，展开了一场搞笑的追逐。',
        duration: '11:45',
        airDate: '2000-06-01'
    },
    {
        id: 'pizza-delivery',
        title: '披萨外送',
        season: 1,
        episode: 5,
        type: 'adventure',
        rating: 9.0,
        description: '海绵宝宝和章鱼哥外送披萨时迷路了，在沙漠中展开冒险。',
        duration: '11:20',
        airDate: '1999-08-14'
    },
    {
        id: 'graveyard-shift',
        title: '墓地班次',
        season: 2,
        episode: 16,
        type: 'comedy',
        rating: 9.3,
        description: '蟹堡王开始24小时营业，章鱼哥给海绵宝宝讲恐怖故事。',
        duration: '11:35',
        airDate: '2002-09-06'
    },
    {
        id: 'sleepy-time',
        title: '睡眠时间',
        season: 1,
        episode: 15,
        type: 'adventure',
        rating: 8.9,
        description: '海绵宝宝进入朋友们的梦境，发现了他们内心的秘密。',
        duration: '11:25',
        airDate: '2000-01-17'
    },
    {
        id: 'krusty-krab-training-video',
        title: '蟹堡王培训视频',
        season: 3,
        episode: 10,
        type: 'work',
        rating: 9.1,
        description: '海绵宝宝观看蟹堡王的员工培训视频，学习如何成为优秀员工。',
        duration: '11:40',
        airDate: '2002-05-10'
    },
    {
        id: 'sailor-mouth',
        title: '水手嘴',
        season: 2,
        episode: 18,
        type: 'comedy',
        rating: 8.8,
        description: '海绵宝宝和派大星学会了一个"坏词"，引发了一系列搞笑事件。',
        duration: '11:30',
        airDate: '2001-09-21'
    }
];

// 当前显示的剧集数量
let currentDisplayCount = 6;
let filteredEpisodes = [...episodesData];

// 用户观看历史和收藏
let watchHistory = JSON.parse(localStorage.getItem('watchHistory') || '[]');
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化剧集页面
    initEpisodesPage();
    
    // 加载剧集列表
    loadEpisodes();
    
    // 初始化动画效果
    initEpisodesAnimations();
});

// 初始化剧集页面
function initEpisodesPage() {
    console.log('剧集页面已加载');
    
    // 为搜索框添加实时搜索
    const searchInput = document.getElementById('episode-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterEpisodes, 300));
    }
    
    // 为推荐剧集添加特效
    const featuredEpisodes = document.querySelectorAll('.featured-episode');
    featuredEpisodes.forEach(episode => {
        episode.addEventListener('mouseenter', function() {
            this.style.borderColor = SpongeBobUtils.getSpongeBobColor();
        });
        
        episode.addEventListener('mouseleave', function() {
            this.style.borderColor = '#FFD700';
        });
    });
}

// 加载剧集列表
function loadEpisodes() {
    const container = document.getElementById('episodes-container');
    if (!container) return;
    
    // 清空容器
    container.innerHTML = '';
    
    // 显示当前筛选后的剧集
    const episodesToShow = filteredEpisodes.slice(0, currentDisplayCount);
    
    episodesToShow.forEach(episode => {
        const episodeCard = createEpisodeCard(episode);
        container.appendChild(episodeCard);
    });
    
    // 更新加载更多按钮状态
    updateLoadMoreButton();
}

// 创建剧集卡片
function createEpisodeCard(episode) {
    const card = document.createElement('div');
    card.className = 'episode-card card';
    card.onclick = () => playEpisode(episode.id);
    
    const stars = '⭐'.repeat(Math.floor(episode.rating));
    
    card.innerHTML = `
        <img src="img/f49cbbe6a55693bff12d3532d45c3071.jpg" alt="${episode.title}" class="placeholder">
        <div class="episode-card-info">
            <h4>${episode.title}</h4>
            <p class="episode-meta">第${episode.season}季 第${episode.episode}集 • ${getTypeText(episode.type)}</p>
            <p>${episode.description}</p>
            <div class="episode-rating">
                <span class="stars">${stars}</span>
                <span class="rating-text">${episode.rating}/10</span>
            </div>
            <div class="episode-actions">
                <button class="btn favorite-toggle" onclick="event.stopPropagation(); toggleFavorite('${episode.id}')">
                    ${favorites.includes(episode.id) ? '❤️ 已收藏' : '🤍 收藏'}
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// 获取类型文本
function getTypeText(type) {
    const typeMap = {
        'comedy': '喜剧',
        'adventure': '冒险',
        'friendship': '友情',
        'work': '工作'
    };
    return typeMap[type] || type;
}

// 筛选剧集
function filterEpisodes() {
    const searchTerm = document.getElementById('episode-search').value.toLowerCase();
    const seasonFilter = document.getElementById('season-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    
    filteredEpisodes = episodesData.filter(episode => {
        const matchesSearch = episode.title.toLowerCase().includes(searchTerm) ||
                            episode.description.toLowerCase().includes(searchTerm);
        const matchesSeason = seasonFilter === 'all' || episode.season.toString() === seasonFilter;
        const matchesType = typeFilter === 'all' || episode.type === typeFilter;
        
        return matchesSearch && matchesSeason && matchesType;
    });
    
    // 重置显示数量
    currentDisplayCount = 6;
    
    // 重新加载剧集
    loadEpisodes();
    
    // 显示筛选结果
    SpongeBobUtils.showMessage(`找到 ${filteredEpisodes.length} 个相关剧集`, 'info');
}

// 加载更多剧集
function loadMoreEpisodes() {
    currentDisplayCount += 6;
    loadEpisodes();
    
    SpongeBobUtils.showMessage('已加载更多剧集', 'success');
}

// 更新加载更多按钮状态
function updateLoadMoreButton() {
    const loadMoreBtn = document.querySelector('.load-more button');
    if (loadMoreBtn) {
        if (currentDisplayCount >= filteredEpisodes.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
            loadMoreBtn.textContent = `加载更多 (还有 ${filteredEpisodes.length - currentDisplayCount} 集)`;
        }
    }
}

// 播放剧集
function playEpisode(episodeId) {
    const episode = episodesData.find(ep => ep.id === episodeId);
    if (!episode) return;
    
    // 添加到观看历史
    addToWatchHistory(episode);
    
    // 显示播放器
    showPlayer(episode);
    
    console.log(`开始播放: ${episode.title}`);
    SpongeBobUtils.showMessage(`正在播放: ${episode.title}`, 'success');
}

// 显示播放器
function showPlayer(episode) {
    const modal = document.getElementById('player-modal');
    const playerBody = document.getElementById('player-body');
    
    playerBody.innerHTML = `
        <h3>${episode.title}</h3>
        <p class="episode-meta">第${episode.season}季 第${episode.episode}集 • 时长: ${episode.duration}</p>
        
        <div class="player-placeholder">
            <div>
                <p>🎬 视频播放器占位</p>
                <p>剧集: ${episode.title}</p>
                <p>正在播放中...</p>
            </div>
        </div>
        
        <div class="player-controls">
            <button class="play-pause-btn" onclick="togglePlayPause()">⏸️ 暂停</button>
            <button class="favorite-btn" onclick="toggleFavorite('${episode.id}')">
                ${favorites.includes(episode.id) ? '❤️ 已收藏' : '🤍 收藏'}
            </button>
        </div>
        
        <p class="episode-description">${episode.description}</p>
    `;
    
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// 关闭播放器
function closePlayer() {
    const modal = document.getElementById('player-modal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// 切换播放/暂停
function togglePlayPause() {
    const btn = document.querySelector('.play-pause-btn');
    if (btn.textContent.includes('暂停')) {
        btn.innerHTML = '▶️ 播放';
        SpongeBobUtils.showMessage('视频已暂停', 'info');
    } else {
        btn.innerHTML = '⏸️ 暂停';
        SpongeBobUtils.showMessage('继续播放', 'info');
    }
}

// 切换收藏状态
function toggleFavorite(episodeId) {
    const episode = episodesData.find(ep => ep.id === episodeId);
    if (!episode) return;
    
    if (favorites.includes(episodeId)) {
        favorites = favorites.filter(id => id !== episodeId);
        SpongeBobUtils.showMessage(`已从收藏中移除: ${episode.title}`, 'info');
    } else {
        favorites.push(episodeId);
        SpongeBobUtils.showMessage(`已收藏: ${episode.title}`, 'success');
    }
    
    // 保存到本地存储
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // 更新界面
    updateFavoriteButtons();
    updateFavoritesSection();
}

// 更新收藏按钮状态
function updateFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite-toggle');
    favoriteButtons.forEach(btn => {
        const episodeId = btn.onclick.toString().match(/'([^']+)'/)[1];
        if (favorites.includes(episodeId)) {
            btn.innerHTML = '❤️ 已收藏';
        } else {
            btn.innerHTML = '🤍 收藏';
        }
    });
}

// 更新收藏夹区域
function updateFavoritesSection() {
    const favoritesGrid = document.querySelector('.favorites-grid');
    if (!favoritesGrid) return;
    
    // 清空现有收藏项（保留添加按钮）
    const addFavorite = favoritesGrid.querySelector('.add-favorite');
    favoritesGrid.innerHTML = '';
    
    // 添加收藏的剧集
    favorites.forEach(episodeId => {
        const episode = episodesData.find(ep => ep.id === episodeId);
        if (episode) {
            const favoriteItem = document.createElement('div');
            favoriteItem.className = 'favorite-item card';
            favoriteItem.innerHTML = `
                <img src="img/fa6b9ad699a0857a47f97fed4038791e.jpg" alt="${episode.title}" class="placeholder">
                <h4>${episode.title}</h4>
                <p>${getTypeText(episode.type)}剧集</p>
                <button class="btn" onclick="removeFavorite('${episode.id}')">移除收藏</button>
            `;
            favoritesGrid.appendChild(favoriteItem);
        }
    });
    
    // 重新添加添加按钮
    if (addFavorite) {
        favoritesGrid.appendChild(addFavorite);
    }
}

// 移除收藏
function removeFavorite(episodeId) {
    toggleFavorite(episodeId);
}

// 添加到观看历史
function addToWatchHistory(episode) {
    // 移除已存在的记录
    watchHistory = watchHistory.filter(item => item.id !== episode.id);
    
    // 添加新记录到开头
    watchHistory.unshift({
        ...episode,
        watchTime: new Date().toISOString(),
        progress: 0
    });
    
    // 限制历史记录数量
    if (watchHistory.length > 10) {
        watchHistory = watchHistory.slice(0, 10);
    }
    
    // 保存到本地存储
    localStorage.setItem('watchHistory', JSON.stringify(watchHistory));
}

// 继续观看
function continueWatching(episodeId) {
    playEpisode(episodeId);
}

// 重新观看
function replayEpisode(episodeId) {
    playEpisode(episodeId);
}

// 初始化动画效果
function initEpisodesAnimations() {
    // 创建交叉观察器
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // 观察所有卡片元素
    const animatedElements = document.querySelectorAll('.featured-episode, .stat-card, .history-item, .favorite-item');
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

// 点击模态框外部关闭
window.addEventListener('click', function(event) {
    const playerModal = document.getElementById('player-modal');
    
    if (event.target === playerModal) {
        closePlayer();
    }
});

// 导出剧集页面功能
window.EpisodesPage = {
    playEpisode,
    toggleFavorite,
    filterEpisodes,
    loadMoreEpisodes,
    episodesData
};