const CUSTOMER_SITES = {
    qiqi: {
        api: 'https://www.qiqidys.com/api.php/provide/vod',
        name: '七七资源',
    },
    tyyszy: {
        api: 'https://www.tyyszy.com/api.php/provide/vod',
        name: '天翼云资源',
    },
    // 新增的电影资源API - 基于苹果CMS V10格式
    hongniu: {
        api: 'https://www.hongniuzy2.com/api.php/provide/vod',
        name: '红牛资源',
    },
    kuaiche: {
        api: 'https://caiji.kczyapi.com/api.php/provide/vod',
        name: '快车资源',
    },
    shandian: {
        api: 'http://sdzyapi.com/api.php/provide/vod',
        name: '闪电资源',
    },
    jinyingm3u8: {
        api: 'http://jyzyapi.com/provide/vod',
        name: '金鹰资源',
    },
    guangsu: {
        api: 'http://api.guangsuapi.com/api.php/provide/vod',
        name: '光速资源',
    },
    aosika: {
        api: 'http://aosikazy.com/api.php/provide/vod',
        name: '奥斯卡资源',
    },
    laoya: {
        api: 'http://api.apilyzy.com/api.php/provide/vod',
        name: '老鸭资源',
    },
    ukuapi: {
        api: 'http://api.ukuapi.com/api.php/provide/vod',
        name: 'U酷资源',
    },
    beidou: {
        api: 'http://m3u8.bdxzyapi.com/api.php/provide/vod',
        name: '北斗星资源',
    },
    kuaibo: {
        api: 'http://www.kuaibozy.com/api.php/provide/vod',
        name: '快播资源',
    },
    aidan: {
        api: 'http://lovedan.net/api.php/provide/vod',
        name: '艾旦影视',
    },
    piaohua: {
        api: 'http://www.zzrhgg.com/api.php/provide/vod',
        name: '飘花电影',
    },
    wangmin: {
        api: 'http://prinevillesda.org/api.php/provide/vod',
        name: '网民电影',
    },
    tiankong: {
        api: 'http://m3u8.tiankongapi.com/api.php/provide/vod',
        name: '天空资源',
    },
    haiwaikan: {
        api: 'https://haiwaikan.com/api.php/provide/vod',
        name: '海外看资源',
    },
    qilin: {
        api: 'https://www.qilinzyz.com/api.php/provide/vod',
        name: '麒麟资源',
    },
    fanqie: {
        api: 'http://api.fqzy.cc/api.php/provide/vod',
        name: '番茄资源',
    },
    feisu: {
        api: 'https://www.feisuzyapi.com/api.php/provide/vod',
        name: '飞速资源',
    },
    kuaikan: {
        api: 'https://www.kuaikan-api.com/api.php/provide/vod',
        name: '快看资源',
    },
    xiongzhang: {
        api: 'https://xzcjz.com/api.php/provide/vod',
        name: '熊掌资源',
    },
    wolong: {
        api: 'https://collect.wolongzyw.com/api.php/provide/vod',
        name: '卧龙资源',
    },
    huya: {
        api: 'https://www.huyaapi.com/api.php/provide/vod',
        name: '虎牙资源',
    },
    piaoling: {
        api: 'https://p2100.net/api.php/provide/vod',
        name: '飘零资源',
    },
    subo: {
        api: 'https://subocaiji.com/api.php/provide/vod',
        name: '速博资源',
    },
    modu: {
        api: 'https://caiji.moduapi.cc/api.php/provide/vod',
        name: '魔都资源2',
    },
    zuidazy: {
        api: 'http://zuidazy.me/api.php/provide/vod',
        name: '最大资源2',
    },
    jisuapi: {
        api: 'https://jszyapi.com/api.php/provide/vod',
        name: '极速资源',
    },
    sijiu: {
        api: 'https://49zyw.com/api.php/provide/vod',
        name: '四九资源',
    },
    suoni: {
        api: 'https://suoniapi.com/api.php/provide/vod',
        name: '索尼资源',
    },
    feifan: {
        api: 'http://cj.ffzyapi.com/api.php/provide/vod',
        name: '非凡资源',
    },
    haohua: {
        api: 'https://hhzyapi.com/api.php/provide/vod',
        name: '豪华资源',
    },
    yaya: {
        api: 'https://cj.yayazy.net/api.php/provide/vod',
        name: '丫丫资源',
    },
    niuniu: {
        api: 'https://api.niuniuzy.me/api.php/provide/vod',
        name: '牛牛资源',
    },
    xiaohuangren: {
        api: 'https://iqyi.xiaohuangrentv.com/api.php/provide/vod',
        name: '小黄人资源',
    },
    huaweiba: {
        api: 'https://hw8.live/api.php/provide/vod',
        name: '华为吧资源',
    },
    yeyu: {
        api: 'https://yyff.540734621.xyz/api.php/provide/vod',
        name: '业余资源',
    },
    citong: {
        api: 'http://ys9.cttv.vip/api.php/provide/vod',
        name: '刺桐资源',
    },
    guanwang: {
        api: 'http://gwcms.cttv.vip/api.php/provide/vod',
        name: '官网资源',
    },
    heimuer: {
        api: 'https://www.heimuer.tv/api.php/provide/vod',
        name: '黑木耳资源',
    },
    qihoo360: {
        api: 'https://360zy.com/api.php/provide/vod',
        name: '360资源',
    }
};

// 调用全局方法合并
if (window.extendAPISites) {
    window.extendAPISites(CUSTOMER_SITES);
} else {
    console.error("错误：请先加载 config.js！");
}
