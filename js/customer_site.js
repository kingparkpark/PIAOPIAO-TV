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
    // 来自GitHub Gist的新增API资源 - 所有非成人内容源
    tangrenjie: {
        api: 'https://www.tangrenjie.tv/api.php/provide/vod/at/xml',
        name: '唐人街影视',
    },
    tiankong2: {
        api: 'http://vipmv.cc/api.php/provide/vod/at/xml',
        name: '天堂资源',
    },
    if101demo: {
        api: 'https://demo.if101.tv/api.php/provide/vod/at/xml',
        name: 'IF101演示',
    },
    if101api: {
        api: 'http://api.if101.tv/v1/vod',
        name: 'IF101接口',
    },
    duboku: {
        api: 'https://raw.githubusercontent.com/trial/dp/master/json2/dbk.json',
        name: '独播库',
    },
    oule: {
        api: 'https://raw.githubusercontent.com/trial/dp/master/json2/olevod.json',
        name: '欧乐影院',
    },
    wwdc2022: {
        api: 'https://raw.githubusercontent.com/trial/dp/master/json2/wwdc2022.json',
        name: 'WWDC2022',
    },
    kuaibo: {
        api: 'http://www.kuaibozy.com/api.php/provide/vod/at/xml',
        name: '快播资源',
    },
    kuyun: {
        api: 'http://caiji.kuyunzy.cc/inc/apijson_vod.php',
        name: '酷云资源',
    },
    ku123: {
        api: 'http://cj.123ku2.com:12315/inc/api.php',
        name: '123资源',
    },
    zy605: {
        api: 'http://www.605zy.co/inc/api.php',
        name: '605资源',
    },
    bajie: {
        api: 'http://cj.bajiecaiji.com/inc/api.php',
        name: '八戒资源',
    },
    baidu: {
        api: 'https://api.apibdzy.com/api.php/provide/vod/at/xml',
        name: '百度资源',
    },
    beidou: {
        api: 'https://api.bdxzy.com/api.php/provide/vod/at/xml',
        name: '北斗星资源',
    },
    chaokuai: {
        api: 'http://www.ckzy.me/api.php/provide/vod/at/xml',
        name: '超快资源',
    },
    feisu: {
        api: 'http://www.feisuzy.com/api.php/provide/vod/at/xml',
        name: '飞速资源',
    },
    guangsu: {
        api: 'http://api.guangsuzy.com/api.php/provide/vod/at/xml',
        name: '光速资源',
    },
    hongniu: {
        api: 'https://www.hongniuzy2.com/api.php/provide/vod/at/xml',
        name: '红牛资源',
    },
    jisu2: {
        api: 'https://www.jszyapi.com/api.php/provide/vod/at/xml',
        name: '极速资源2',
    },
    jinying: {
        api: 'https://jyzyapi.com/api.php/provide/vod/at/xml',
        name: '金鹰资源',
    },
    kuaiche: {
        api: 'https://caiji.kczyapi.com/api.php/provide/vod/at/xml',
        name: '快车资源',
    },
    leduo: {
        api: 'http://www.leduozy.com/inc/api.php',
        name: '乐多资源',
    },
    liangzi: {
        api: 'http://cj.lziapi.com/api.php/provide/vod/at/xml',
        name: '量子资源',
    },
    maomi: {
        api: 'http://zy.xiaomaomi.cc/api.php/provide/vod/at/xml',
        name: '猫咪资源',
    },
    mingri: {
        api: 'http://zy.zcocc.com/api.php/provide/vod/at/xml',
        name: '明日资源',
    },
    pianku: {
        api: 'https://pianku.wang/api.php/provide/vod/at/xml',
        name: '片库资源',
    },
    qiyi: {
        api: 'https://caiji.qiyiapi.com/api.php/provide/vod/at/xml',
        name: '奇艺资源',
    },
    sugeng: {
        api: 'https://sugengzy.cn/api.php/provide/vod/at/xml',
        name: '速更资源',
    },
    taopian: {
        api: 'https://taopianzy.com/api.php/provide/vod/at/xml',
        name: '淘片资源',
    },
    wujin: {
        api: 'https://api.wujinapi.me/api.php/provide/vod/at/xml',
        name: '无尽资源',
    },
    xinlang: {
        api: 'https://api.xinlangapi.com/xinlangapi.php/provide/vod/at/xml',
        name: '新浪资源',
    },
    yinghua: {
        api: 'https://m3u8.apiyhzy.com/api.php/provide/vod/at/xml',
        name: '樱花资源',
    },
    yule: {
        api: 'https://api.ylzy.me/api.php/provide/vod/at/xml',
        name: '鱼乐资源',
    },
    zhuiju: {
        api: 'https://www.zju8.cc/api.php/provide/vod/at/xml',
        name: '追剧达人',
    }
};

// 调用全局方法合并
if (window.extendAPISites) {
    window.extendAPISites(CUSTOMER_SITES);
} else {
    console.error("错误：请先加载 config.js！");
}
