const CUSTOMER_SITES = {
    qiqi: {
        api: 'https://www.qiqidys.com/api.php/provide/vod',
        name: '七七资源',
    },
    tyyszy: {
        api: 'https://www.tyyszy.com/api.php/provide/vod',
        name: '天翼云资源',
    },
    dyttzy: {
        api: 'https://www.dyttzy.com/api.php/provide/vod',
        name: '大洋天天资源',
    },
    bfzy: {
        api: 'https://www.bfzy.tv/api.php/provide/vod',
        name: '暴风资源',
    },
    ruyi: {
        api: 'https://www.ruyizy.cc/api.php/provide/vod',
        name: '如意资源',
    }
};

// 调用全局方法合并
if (window.extendAPISites) {
    window.extendAPISites(CUSTOMER_SITES);
} else {
    console.error("错误：请先加载 config.js！");
}
