// TMDB 热门影视推荐功能 - 替代豆瓣数据源
// The Movie Database (TMDB) API Integration

// TMDB API 配置
const TMDB_CONFIG = {
    apiKey: '43a9e8fec2e06deb50a91eccf5d5f5cc',
    accessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0M2E5ZThmZWMyZTA2ZGViNTBhOTFlY2NmNWQ1ZjVjYyIsIm5iZiI6MTc2ODIzNDA5My44MDQ5OTk4LCJzdWIiOiI2OTY1MWM2ZDFmY2U1OTgxNjJkOGM4OWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.P7le7YVAHh9DgQS97HOIcvu2MOC0t_dm1765y5h2ymk',
    baseUrl: 'https://api.themoviedb.org/3',
    imageBaseUrl: 'https://image.tmdb.org/t/p/w500',
    language: 'zh-CN'
};

// 电影标签分类
const tmdbMovieTags = [
    { name: '热门', endpoint: 'trending/movie/week' },
    { name: '正在热映', endpoint: 'movie/now_playing' },
    { name: '即将上映', endpoint: 'movie/upcoming' },
    { name: '高分佳作', endpoint: 'movie/top_rated' },
    { name: '经典热门', endpoint: 'movie/popular' }
];

// 电视剧标签分类
const tmdbTvTags = [
    { name: '热门', endpoint: 'trending/tv/week' },
    { name: '正在播出', endpoint: 'tv/on_the_air' },
    { name: '今日热播', endpoint: 'tv/airing_today' },
    { name: '高分佳作', endpoint: 'tv/top_rated' },
    { name: '经典热门', endpoint: 'tv/popular' }
];

// 当前状态
let tmdbCurrentSwitch = 'movie'; // 'movie' 或 'tv'
let tmdbCurrentTagIndex = 0;     // 顶部标签索引
let tmdbCurrentGenreId = null;   // 当前选中的类型ID (互斥：选中类型时，tagIndex失效)
let tmdbCurrentPage = 1;

// 缓存 Genre 列表
let tmdbMovieGenres = [];
let tmdbTvGenres = [];

// 初始化 TMDB 功能
function initTMDB() {
    console.log('[TMDB] 初始化 TMDB 热门推荐模块...');

    // 检查是否启用豆瓣/TMDB推荐功能
    const doubanToggle = document.getElementById('doubanToggle');
    if (doubanToggle) {
        const isEnabled = localStorage.getItem('doubanEnabled') === 'true';
        doubanToggle.checked = isEnabled;

        // 设置开关外观
        const toggleBg = doubanToggle.nextElementSibling;
        const toggleDot = toggleBg ? toggleBg.nextElementSibling : null;
        if (isEnabled && toggleBg && toggleDot) {
            toggleBg.classList.add('bg-pink-600');
            toggleDot.classList.add('translate-x-6');
        }

        // 添加事件监听
        doubanToggle.addEventListener('change', function (e) {
            const isChecked = e.target.checked;
            localStorage.setItem('doubanEnabled', isChecked);

            // 更新开关外观
            if (toggleBg && toggleDot) {
                if (isChecked) {
                    toggleBg.classList.add('bg-pink-600');
                    toggleDot.classList.add('translate-x-6');
                } else {
                    toggleBg.classList.remove('bg-pink-600');
                    toggleDot.classList.remove('translate-x-6');
                }
            }

            // 更新显示状态
            updateTMDBVisibility();
        });

        // 初始更新显示状态
        updateTMDBVisibility();
    }

    // 渲染电影/电视剧切换
    renderTMDBMovieTvSwitch();

    // 获取类型列表
    fetchTMDBGenres().then(() => {
        renderTMDBGenres(); // 渲染类型按钮
    });

    // 渲染常用标签
    renderTMDBTags();

    // 换一批按钮事件监听
    setupTMDBRefreshBtn();

    // 初始加载热门内容
    if (localStorage.getItem('doubanEnabled') === 'true') {
        // 稍微延迟加载内容，确保容器尺寸就绪，避免 lazy load 问题
        setTimeout(renderTMDBRecommend, 100);
    }

    console.log('[TMDB] 初始化完成');
}

// 更新 TMDB 区域的显示状态
function updateTMDBVisibility() {
    const doubanArea = document.getElementById('doubanArea');
    if (!doubanArea) return;

    const isEnabled = localStorage.getItem('doubanEnabled') === 'true';
    const resultsArea = document.getElementById('resultsArea');
    const isSearching = resultsArea && !resultsArea.classList.contains('hidden');

    // 只有在启用且没有搜索结果显示时才显示 TMDB 区域
    if (isEnabled && !isSearching) {
        doubanArea.classList.remove('hidden');
        // 显示类型筛选器
        const genreWrapper = document.getElementById('tmdb-genres-wrapper');
        if (genreWrapper) genreWrapper.classList.remove('hidden');

        // 如果 TMDB 结果为空，重新加载
        const resultsContainer = document.getElementById('douban-results');
        if (resultsContainer && resultsContainer.children.length === 0) {
            renderTMDBRecommend();
        }
    } else {
        doubanArea.classList.add('hidden');
        const genreWrapper = document.getElementById('tmdb-genres-wrapper');
        if (genreWrapper) genreWrapper.classList.add('hidden');
    }
}

// 渲染电影/电视剧切换器
function renderTMDBMovieTvSwitch() {
    const movieToggle = document.getElementById('douban-movie-toggle');
    const tvToggle = document.getElementById('douban-tv-toggle');

    if (!movieToggle || !tvToggle) return;

    movieToggle.addEventListener('click', function () {
        if (tmdbCurrentSwitch !== 'movie') {
            switchMediaType('movie', movieToggle, tvToggle);
        }
    });

    tvToggle.addEventListener('click', function () {
        if (tmdbCurrentSwitch !== 'tv') {
            switchMediaType('tv', tvToggle, movieToggle);
        }
    });
}

// 切换媒体类型通用逻辑
function switchMediaType(type, activeBtn, inactiveBtn) {
    // 更新按钮样式
    activeBtn.classList.add('bg-pink-600', 'text-white');
    activeBtn.classList.remove('text-gray-300');

    inactiveBtn.classList.remove('bg-pink-600', 'text-white');
    inactiveBtn.classList.add('text-gray-300');

    tmdbCurrentSwitch = type;
    tmdbCurrentTagIndex = 0; // 重置回"热门"
    tmdbCurrentGenreId = null; // 清除类型选择
    tmdbCurrentPage = 1;

    // 重新渲染标签和内容
    renderTMDBTags();
    renderTMDBGenres(); // 重新渲染对应的类型列表
    setupTMDBRefreshBtn();

    if (localStorage.getItem('doubanEnabled') === 'true') {
        renderTMDBRecommend();
    }
}

// 获取类型列表
async function fetchTMDBGenres() {
    try {
        // 获取电影类型
        if (tmdbMovieGenres.length === 0) {
            const res = await fetch(`${TMDB_CONFIG.baseUrl}/genre/movie/list?language=${TMDB_CONFIG.language}`, {
                headers: { 'Authorization': `Bearer ${TMDB_CONFIG.accessToken}` }
            });
            const data = await res.json();
            tmdbMovieGenres = data.genres || [];
        }

        // 获取电视剧类型
        if (tmdbTvGenres.length === 0) {
            const res = await fetch(`${TMDB_CONFIG.baseUrl}/genre/tv/list?language=${TMDB_CONFIG.language}`, {
                headers: { 'Authorization': `Bearer ${TMDB_CONFIG.accessToken}` }
            });
            const data = await res.json();
            tmdbTvGenres = data.genres || [];
        }
    } catch (e) {
        console.error('[TMDB] 获取类型列表失败', e);
    }
}

// 渲染类型筛选按钮
function renderTMDBGenres() {
    const container = document.getElementById('tmdb-genres');
    if (!container) return;

    container.innerHTML = '';

    const genres = tmdbCurrentSwitch === 'movie' ? tmdbMovieGenres : tmdbTvGenres;

    genres.forEach(g => {
        const btn = document.createElement('button');
        let btnClass = 'whitespace-nowrap px-3 py-1 text-xs rounded-full border transition-all duration-300 ';

        if (tmdbCurrentGenreId === g.id) {
            btnClass += 'bg-pink-600 text-white border-pink-500 shadow-md';
        } else {
            btnClass += 'bg-[#1a1a1a] text-gray-400 border-[#333] hover:border-gray-500 hover:text-white';
        }

        btn.className = btnClass;
        btn.textContent = g.name;

        btn.onclick = () => {
            // 点击类型：激活类型，清除顶部标签选中状态
            if (tmdbCurrentGenreId !== g.id) {
                tmdbCurrentGenreId = g.id;
                tmdbCurrentTagIndex = -1; // -1 表示不使用顶部常用标签
                tmdbCurrentPage = 1;
                renderTMDBTags();   // 更新顶部标签样式（变灰）
                renderTMDBGenres(); // 更新自己高亮
                renderTMDBRecommend();
            } else {
                // 再次点击取消筛选，回到默认热门
                tmdbCurrentGenreId = null;
                tmdbCurrentTagIndex = 0;
                tmdbCurrentPage = 1;
                renderTMDBTags();
                renderTMDBGenres();
                renderTMDBRecommend();
            }
        };

        container.appendChild(btn);
    });
}

// 渲染 TMDB 常用标签 (热门、即将上映等)
function renderTMDBTags() {
    const tagContainer = document.getElementById('douban-tags');
    if (!tagContainer) return;

    const currentTags = tmdbCurrentSwitch === 'movie' ? tmdbMovieTags : tmdbTvTags;

    tagContainer.innerHTML = '';

    currentTags.forEach((tag, index) => {
        const btn = document.createElement('button');

        let btnClass = 'py-1.5 px-3.5 rounded text-sm font-medium transition-all duration-300 border ';

        if (index === tmdbCurrentTagIndex) {
            btnClass += 'bg-pink-600 text-white shadow-md border-white';
        } else {
            btnClass += 'bg-[#1a1a1a] text-gray-300 hover:bg-pink-700 hover:text-white border-[#333] hover:border-white';
        }

        btn.className = btnClass;
        btn.textContent = tag.name;

        btn.onclick = function () {
            if (tmdbCurrentTagIndex !== index) {
                tmdbCurrentTagIndex = index;
                tmdbCurrentGenreId = null; // 清除类型筛选
                tmdbCurrentPage = 1;
                renderTMDBGenres(); // 清除类型高亮
                renderTMDBTags();   // 高亮自己
                renderTMDBRecommend();
            }
        };

        tagContainer.appendChild(btn);
    });
}

// 设置换一批按钮事件
function setupTMDBRefreshBtn() {
    const btn = document.getElementById('douban-refresh');
    if (!btn) return;

    btn.onclick = function () {
        tmdbCurrentPage++;
        if (tmdbCurrentPage > 10) { // 增加翻页上限
            tmdbCurrentPage = 1;
        }
        renderTMDBRecommend();
    };
}

// 渲染热门推荐内容
async function renderTMDBRecommend() {
    const container = document.getElementById('douban-results');
    if (!container) return;

    // 显示加载动画
    const loadingOverlayHTML = `
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10 min-h-[300px]">
            <div class="flex items-center justify-center">
                <div class="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin inline-block"></div>
                <span class="text-pink-500 ml-4">加载中...</span>
            </div>
        </div>
    `;

    // 只有当容器已经有内容时才加 overlay，否则直接显示 loading
    if (container.children.length > 0) {
        container.classList.add('relative');
        container.insertAdjacentHTML('beforeend', loadingOverlayHTML);
    } else {
        container.innerHTML = loadingOverlayHTML;
    }

    try {
        const data = await fetchTMDBData();
        renderTMDBCards(data, container);
    } catch (error) {
        console.error('[TMDB] 获取数据失败:', error);
        container.innerHTML = `
            <div class="col-span-full text-center py-8">
                <div class="text-red-400">❌ 获取 TMDB 数据失败，请稍后重试</div>
                <div class="text-gray-500 text-sm mt-2">错误: ${error.message}</div>
                <button onclick="renderTMDBRecommend()" class="mt-4 px-4 py-2 bg-[#333] hover:bg-[#444] rounded text-white text-sm">重试</button>
            </div>
        `;
    }
}

// 从 TMDB API 获取数据
async function fetchTMDBData() {
    let url = '';
    const type = tmdbCurrentSwitch;

    // 模式 1: 按类型筛选 (Discover API)
    if (tmdbCurrentGenreId) {
        url = `${TMDB_CONFIG.baseUrl}/discover/${type}?language=${TMDB_CONFIG.language}&page=${tmdbCurrentPage}&with_genres=${tmdbCurrentGenreId}&sort_by=popularity.desc`;
    }
    // 模式 2: 常用标签 (Trending / Movie lists)
    else {
        const currentTags = type === 'movie' ? tmdbMovieTags : tmdbTvTags;
        // 如果异常情况导致 index -1 且无 genre，默认回 0
        const tagIndex = tmdbCurrentTagIndex >= 0 ? tmdbCurrentTagIndex : 0;
        const currentTag = currentTags[tagIndex];
        url = `${TMDB_CONFIG.baseUrl}/${currentTag.endpoint}?language=${TMDB_CONFIG.language}&page=${tmdbCurrentPage}`;
    }

    console.log('[TMDB] 请求 URL:', url);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${TMDB_CONFIG.accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP 错误! 状态码: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

// 渲染 TMDB 卡片
function renderTMDBCards(data, container) {
    const fragment = document.createDocumentFragment();

    if (!data.results || data.results.length === 0) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'col-span-full text-center py-8';
        emptyEl.innerHTML = `
            <div class="text-pink-500">❌ 暂无该分类数据</div>
        `;
        fragment.appendChild(emptyEl);
    } else {
        // 只取前16条数据
        const items = data.results.slice(0, 16);

        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'bg-[#111] hover:bg-[#222] transition-all duration-300 rounded-lg overflow-hidden flex flex-col transform hover:scale-105 shadow-md hover:shadow-lg';

            const title = item.title || item.name || '未知标题';
            const safeTitle = title
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');

            const rating = item.vote_average ? item.vote_average.toFixed(1) : '暂无';
            const posterPath = item.poster_path;

            // 构建图片URL - 直接使用TMDB CDN
            const coverUrl = posterPath
                ? `${TMDB_CONFIG.imageBaseUrl}${posterPath}`
                : '';

            // 占位图 - 使用encodeURIComponent确保正确编码
            const placeholderSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"><rect fill="#1a1a1a" width="300" height="450"/><text fill="#666" font-size="16" x="150" y="225" text-anchor="middle">加载中...</text></svg>';
            const placeholderUrl = 'data:image/svg+xml,' + encodeURIComponent(placeholderSvg);

            const tmdbType = tmdbCurrentSwitch;
            const tmdbUrl = `https://www.themoviedb.org/${tmdbType}/${item.id}?language=zh-CN`;

            // 创建图片元素，使用 JavaScript 控制加载
            const imgId = `tmdb-img-${item.id}-${index}`;

            card.innerHTML = `
                <div class="relative w-full aspect-[2/3] overflow-hidden cursor-pointer" onclick="fillAndSearchWithTMDB('${safeTitle}')">
                    <img id="${imgId}" 
                        src="${placeholderUrl}" 
                        data-src="${coverUrl}"
                        alt="${safeTitle}" 
                        class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onclick="event.stopPropagation(); retryImageLoad(this);">
                    <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                    <div class="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-sm">
                        <span class="text-yellow-400">★</span> ${rating}
                    </div>
                    <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-sm hover:bg-[#333] transition-colors">
                        <a href="${tmdbUrl}" target="_blank" rel="noopener noreferrer" title="在 TMDB 查看" onclick="event.stopPropagation();">
                            🔗
                        </a>
                    </div>
                </div>
                <div class="p-2 text-center bg-[#111]">
                    <button onclick="fillAndSearchWithTMDB('${safeTitle}')" 
                            class="text-sm font-medium text-white truncate w-full hover:text-pink-400 transition"
                            title="${safeTitle}">
                        ${safeTitle}
                    </button>
                </div>
            `;

            fragment.appendChild(card);
        });
    }

    container.innerHTML = '';
    container.appendChild(fragment);

    // 立即开始加载所有图片
    setTimeout(() => {
        loadTMDBImages();
    }, 50);
}

// 加载所有 TMDB 图片
function loadTMDBImages() {
    const images = document.querySelectorAll('[id^="tmdb-img-"]');
    images.forEach((img, index) => {
        const realSrc = img.getAttribute('data-src');
        if (!realSrc) return;

        // 渐进式加载：前8张立即加载，后面的延迟
        const delay = index < 8 ? 0 : (index - 8) * 100;

        setTimeout(() => {
            const testImg = new Image();
            testImg.onload = () => {
                img.src = realSrc;
                img.classList.add('loaded');
            };
            testImg.onerror = () => {
                // 图片加载失败，显示错误占位图
                const errorSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"><rect fill="#222" width="300" height="450"/><text fill="#666" font-size="14" x="150" y="225" text-anchor="middle">加载失败</text></svg>';
                img.src = 'data:image/svg+xml,' + encodeURIComponent(errorSvg);
                img.setAttribute('data-failed', 'true');
            };
            testImg.src = realSrc;
        }, delay);
    });
}

// 重试加载单张图片
function retryImageLoad(img) {
    const realSrc = img.getAttribute('data-src');
    if (!realSrc) return;

    // 显示加载中
    const loadingSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"><rect fill="#1a1a1a" width="300" height="450"/><text fill="#888" font-size="14" x="150" y="225" text-anchor="middle">重新加载中...</text></svg>';
    img.src = 'data:image/svg+xml,' + encodeURIComponent(loadingSvg);

    setTimeout(() => {
        const testImg = new Image();
        testImg.onload = () => {
            img.src = realSrc;
            img.removeAttribute('data-failed');
        };
        testImg.onerror = () => {
            const errorSvg2 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"><rect fill="#222" width="300" height="450"/><text fill="#666" font-size="14" x="150" y="225" text-anchor="middle">加载失败</text></svg>';
            img.src = 'data:image/svg+xml,' + encodeURIComponent(errorSvg2);
        };
        testImg.src = realSrc + '?retry=' + Date.now(); // 添加随机参数绕过缓存
    }, 100);
}

// 导出重试函数
window.retryImageLoad = retryImageLoad;

// 填充搜索框并执行搜索
async function fillAndSearchWithTMDB(title) {
    if (!title) return;
    const safeTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    const input = document.getElementById('searchInput');
    if (input) {
        input.value = safeTitle;
        if (typeof search === 'function') {
            await search();
        }
        try {
            const encodedQuery = encodeURIComponent(safeTitle);
            window.history.pushState(
                { search: safeTitle },
                `搜索: ${safeTitle} - 朴朴TV`,
                `/s=${encodedQuery}`
            );
            document.title = `搜索: ${safeTitle} - 朴朴TV`;
        } catch (e) { console.error(e); }

        if (window.innerWidth <= 768) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

function resetToHomeTMDB() {
    if (typeof resetSearchArea === 'function') resetSearchArea();
    updateTMDBVisibility();
}

document.addEventListener('DOMContentLoaded', function () {
    // 延迟初始化以兼容其他脚本
    setTimeout(initTMDB, 150);
});

window.initTMDB = initTMDB;
window.updateTMDBVisibility = updateTMDBVisibility;
window.fillAndSearchWithTMDB = fillAndSearchWithTMDB;
window.resetToHomeTMDB = resetToHomeTMDB;
