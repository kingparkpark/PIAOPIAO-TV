const CUSTOMER_SITES = {
    qiqi: {
        api: 'https://www.qiqidys.com/api.php/provide/vod',
        name: '七七资源',
    },
    tyyszy: {
        api: 'https://www.tyyszy.com/api.php/provide/vod',
        name: '天翼云资源',
    },
    // 经过验证的稳定API资源 - 基于苹果CMS V10格式
    qilin: {
        api: 'https://www.qilinzyz.com/api.php/provide/vod',
        name: '麒麟资源',
    },
    wolong: {
        api: 'https://collect.wolongzyw.com/api.php/provide/vod',
        name: '卧龙资源',
    },
    feifan: {
        api: 'http://cj.ffzyapi.com/api.php/provide/vod',
        name: '非凡资源',
    },
    tiankong: {
        api: 'http://m3u8.tiankongapi.com/api.php/provide/vod',
        name: '天空资源',
    },
    jisuapi: {
        api: 'https://jszyapi.com/api.php/provide/vod',
        name: '极速资源',
    },
    subo: {
        api: 'https://subocaiji.com/api.php/provide/vod',
        name: '速博资源',
    },
    xiongzhang: {
        api: 'https://xzcjz.com/api.php/provide/vod',
        name: '熊掌资源',
    },
    haiwaikan: {
        api: 'https://haiwaikan.com/api.php/provide/vod',
        name: '海外看资源',
    },
    // 来自GitHub Gist的新增API资源
    tangrenjie: {
        api: 'https://www.tangrenjie.tv/api.php/provide/vod',
        name: '唐人街影视',
    },
    tiankong2: {
        api: 'http://vipmv.cc/api.php/provide/vod',
        name: '天堂资源',
    },
    if101demo: {
        api: 'https://demo.if101.tv/api.php/provide/vod',
        name: 'IF101演示',
    }
};

// 调用全局方法合并
if (window.extendAPISites) {
    window.extendAPISites(CUSTOMER_SITES);
} else {
    console.error("错误：请先加载 config.js！");
}
