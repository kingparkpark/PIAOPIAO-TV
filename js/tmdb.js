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
let tmdbCurrentTagIndex = 0;
let tmdbCurrentPage = 1;

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

    // 渲染标签
    renderTMDBTags();

    // 换一批按钮事件监听
    setupTMDBRefreshBtn();

    // 初始加载热门内容
    if (localStorage.getItem('doubanEnabled') === 'true') {
        renderTMDBRecommend();
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
        // 如果 TMDB 结果为空，重新加载
        const resultsContainer = document.getElementById('douban-results');
        if (resultsContainer && resultsContainer.children.length === 0) {
            renderTMDBRecommend();
        }
    } else {
        doubanArea.classList.add('hidden');
    }
}

// 渲染电影/电视剧切换器
function renderTMDBMovieTvSwitch() {
    const movieToggle = document.getElementById('douban-movie-toggle');
    const tvToggle = document.getElementById('douban-tv-toggle');

    if (!movieToggle || !tvToggle) return;

    movieToggle.addEventListener('click', function () {
        if (tmdbCurrentSwitch !== 'movie') {
            // 更新按钮样式
            movieToggle.classList.add('bg-pink-600', 'text-white');
            movieToggle.classList.remove('text-gray-300');

            tvToggle.classList.remove('bg-pink-600', 'text-white');
            tvToggle.classList.add('text-gray-300');

            tmdbCurrentSwitch = 'movie';
            tmdbCurrentTagIndex = 0;
            tmdbCurrentPage = 1;

            // 重新渲染标签和内容
            renderTMDBTags();
            setupTMDBRefreshBtn();

            if (localStorage.getItem('doubanEnabled') === 'true') {
                renderTMDBRecommend();
            }
        }
    });

    tvToggle.addEventListener('click', function () {
        if (tmdbCurrentSwitch !== 'tv') {
            // 更新按钮样式
            tvToggle.classList.add('bg-pink-600', 'text-white');
            tvToggle.classList.remove('text-gray-300');

            movieToggle.classList.remove('bg-pink-600', 'text-white');
            movieToggle.classList.add('text-gray-300');

            tmdbCurrentSwitch = 'tv';
            tmdbCurrentTagIndex = 0;
            tmdbCurrentPage = 1;

            // 重新渲染标签和内容
            renderTMDBTags();
            setupTMDBRefreshBtn();

            if (localStorage.getItem('doubanEnabled') === 'true') {
                renderTMDBRecommend();
            }
        }
    });
}

// 渲染 TMDB 标签选择器
function renderTMDBTags() {
    const tagContainer = document.getElementById('douban-tags');
    if (!tagContainer) return;

    // 确定当前使用的标签列表
    const currentTags = tmdbCurrentSwitch === 'movie' ? tmdbMovieTags : tmdbTvTags;

    // 清空标签容器
    tagContainer.innerHTML = '';

    // 添加所有标签
    currentTags.forEach((tag, index) => {
        const btn = document.createElement('button');

        // 设置样式
        let btnClass = 'py-1.5 px-3.5 rounded text-sm font-medium transition-all duration-300 border ';

        // 当前选中的标签使用高亮样式
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
                tmdbCurrentPage = 1;
                renderTMDBRecommend();
                renderTMDBTags();
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
        if (tmdbCurrentPage > 5) {
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
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div class="flex items-center justify-center">
                <div class="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin inline-block"></div>
                <span class="text-pink-500 ml-4">加载中...</span>
            </div>
        </div>
    `;

    container.classList.add('relative');
    container.insertAdjacentHTML('beforeend', loadingOverlayHTML);

    try {
        const data = await fetchTMDBData();
        renderTMDBCards(data, container);
    } catch (error) {
        console.error('[TMDB] 获取数据失败:', error);
        container.innerHTML = `
            <div class="col-span-full text-center py-8">
                <div class="text-red-400">❌ 获取 TMDB 数据失败，请稍后重试</div>
                <div class="text-gray-500 text-sm mt-2">错误: ${error.message}</div>
            </div>
        `;
    }
}

// 从 TMDB API 获取数据
async function fetchTMDBData() {
    const currentTags = tmdbCurrentSwitch === 'movie' ? tmdbMovieTags : tmdbTvTags;
    const currentTag = currentTags[tmdbCurrentTagIndex];

    const url = `${TMDB_CONFIG.baseUrl}/${currentTag.endpoint}?language=${TMDB_CONFIG.language}&page=${tmdbCurrentPage}`;

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
    console.log('[TMDB] 获取到数据:', data.results?.length, '条');
    return data;
}

// 渲染 TMDB 卡片
function renderTMDBCards(data, container) {
    // 创建文档片段以提高性能
    const fragment = document.createDocumentFragment();

    // 如果没有数据
    if (!data.results || data.results.length === 0) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'col-span-full text-center py-8';
        emptyEl.innerHTML = `
            <div class="text-pink-500">❌ 暂无数据，请尝试其他分类或刷新</div>
        `;
        fragment.appendChild(emptyEl);
    } else {
        // 只取前16条数据
        const items = data.results.slice(0, 16);

        // 循环创建每个影视卡片
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'bg-[#111] hover:bg-[#222] transition-all duration-300 rounded-lg overflow-hidden flex flex-col transform hover:scale-105 shadow-md hover:shadow-lg';

            // 获取标题 (电影用 title, 电视剧用 name)
            const title = item.title || item.name || '未知标题';
            const safeTitle = title
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');

            // 获取评分
            const rating = item.vote_average ? item.vote_average.toFixed(1) : '暂无';

            // 处理图片 URL
            const posterPath = item.poster_path;
            const coverUrl = posterPath
                ? `${TMDB_CONFIG.imageBaseUrl}${posterPath}`
                : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"><rect fill="%23333" width="300" height="450"/><text fill="%23666" font-size="20" x="150" y="225" text-anchor="middle">暂无图片</text></svg>';

            // TMDB 详情页 URL
            const tmdbType = tmdbCurrentSwitch === 'movie' ? 'movie' : 'tv';
            const tmdbUrl = `https://www.themoviedb.org/${tmdbType}/${item.id}?language=zh-CN`;

            // 生成卡片内容
            card.innerHTML = `
                <div class="relative w-full aspect-[2/3] overflow-hidden cursor-pointer" onclick="fillAndSearchWithTMDB('${safeTitle}')">
                    <img src="${coverUrl}" alt="${safeTitle}" 
                        class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        loading="lazy"
                        onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 450%22><rect fill=%22%23333%22 width=%22300%22 height=%22450%22/><text fill=%22%23666%22 font-size=%2220%22 x=%22150%22 y=%22225%22 text-anchor=%22middle%22>加载失败</text></svg>'">
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

    // 清空并添加所有新元素
    container.innerHTML = '';
    container.appendChild(fragment);
}

// 填充搜索框并执行搜索 (TMDB 版本)
async function fillAndSearchWithTMDB(title) {
    if (!title) return;

    // 安全处理标题，防止XSS
    const safeTitle = title
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    // 填充搜索框并执行搜索
    const input = document.getElementById('searchInput');
    if (input) {
        input.value = safeTitle;

        // 检查是否有 search 函数
        if (typeof search === 'function') {
            await search();
        }

        // 更新浏览器URL
        try {
            const encodedQuery = encodeURIComponent(safeTitle);
            window.history.pushState(
                { search: safeTitle },
                `搜索: ${safeTitle} - 朴朴TV`,
                `/s=${encodedQuery}`
            );
            document.title = `搜索: ${safeTitle} - 朴朴TV`;
        } catch (e) {
            console.error('[TMDB] 更新浏览器历史失败:', e);
        }

        // 移动端滚动到顶部
        if (window.innerWidth <= 768) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
}

// 重置到首页
function resetToHomeTMDB() {
    if (typeof resetSearchArea === 'function') {
        resetSearchArea();
    }
    updateTMDBVisibility();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    // 延迟一点初始化，确保 DOM 完全加载
    setTimeout(initTMDB, 100);
});

// 导出函数供全局使用
window.initTMDB = initTMDB;
window.updateTMDBVisibility = updateTMDBVisibility;
window.fillAndSearchWithTMDB = fillAndSearchWithTMDB;
window.resetToHomeTMDB = resetToHomeTMDB;
