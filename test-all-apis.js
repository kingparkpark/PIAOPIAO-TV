// 全面API测试脚本
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 模拟浏览器环境
global.window = {};
global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
};

// 手动定义API配置（从config.js复制）
const API_SITES = {
    dyttzy: {
        api: 'http://caiji.dyttzyapi.com/api.php/provide/vod',
        name: '电影天堂资源',
        detail: 'http://caiji.dyttzyapi.com',
    },
    heimuer: {
        api: 'https://json.heimuer.xyz/api.php/provide/vod',
        name: '黑木耳',
        detail: 'https://heimuer.tv'
    },
    ruyi: {
        api: 'https://cj.rycjapi.com/api.php/provide/vod',
        name: '如意资源',
    },
    bfzy: {
        api: 'https://bfzyapi.com/api.php/provide/vod',
        name: '暴风资源',
    },
    tyyszy: {
        api: 'https://tyyszy.com/api.php/provide/vod',
        name: '天涯资源'
    },
    ffzy: {
        api: 'http://ffzy5.tv/api.php/provide/vod',
        name: '非凡影视',
        detail: 'http://ffzy5.tv'
    },
    zy360: {
        api: 'https://360zy.com/api.php/provide/vod',
        name: '360资源'
    },
    maotaizy: {
        api: 'https://caiji.maotaizy.cc/api.php/provide/vod',
        name: '茅台资源'
    },
    wolong: {
        api: 'https://wolongzyw.com/api.php/provide/vod',
        name: '卧龙资源'
    },
    jisu: {
        api: 'https://jszyapi.com/api.php/provide/vod',
        name: '极速资源',
        detail: 'https://jszyapi.com'
    },
    dbzy: {
        api: 'https://dbzy.tv/api.php/provide/vod',
        name: '豆瓣资源',
    },
    mozhua: {
        api: 'https://mozhuazy.com/api.php/provide/vod',
        name: '魔爪资源',
    },
    mdzy: {
        api: 'https://www.mdzyapi.com/api.php/provide/vod',
        name: '魔都资源',
    },
    zuid: {
        api: 'https://api.zuidapi.com/api.php/provide/vod',
        name: '最大资源'
    },
    yinghua: {
        api: 'https://m3u8.apiyhzy.com/api.php/provide/vod',
        name: '樱花资源'
    },
    baidu: {
        api: 'https://api.apibdzy.com/api.php/provide/vod',
        name: '百度云资源'
    },
    wujin: {
        api: 'https://api.wujinapi.me/api.php/provide/vod',
        name: '无尽资源'
    },
    wwzy: {
        api: 'https://wwzy.tv/api.php/provide/vod',
        name: '旺旺短剧'
    },
    ikun: {
        api: 'https://ikunzyapi.com/api.php/provide/vod',
        name: 'iKun资源'
    },
    lzi: {
        api: 'https://cj.lziapi.com/api.php/provide/vod',
        name: '量子资源站'
    },
    xiaomaomi: {
        api: 'https://zy.xmm.hk/api.php/provide/vod',
        name: '小猫咪资源'
    }
};

// 测试结果存储
const testResults = {
    timestamp: new Date().toISOString(),
    totalAPIs: 0,
    successfulAPIs: 0,
    failedAPIs: 0,
    results: [],
    summary: {}
};

// HTTP请求函数
async function makeRequest(url, timeout = 10000) {
    
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const client = urlObj.protocol === 'https:' ? https : http;
        
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            },
            timeout: timeout
        };
        
        const req = client.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        status: res.statusCode,
                        data: jsonData,
                        headers: res.headers
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: data,
                        headers: res.headers,
                        parseError: e.message
                    });
                }
            });
        });
        
        req.on('error', (err) => {
            reject(err);
        });
        
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        req.end();
    });
}

// 测试单个API
async function testAPI(apiKey, apiConfig) {
    const result = {
        apiKey,
        name: apiConfig.name,
        url: apiConfig.api,
        detail: apiConfig.detail || '',
        adult: apiConfig.adult || false,
        tests: {
            connectivity: { status: 'pending', message: '', responseTime: 0 },
            search: { status: 'pending', message: '', responseTime: 0, resultCount: 0 },
            detail: { status: 'pending', message: '', responseTime: 0 }
        },
        overall: 'pending'
    };
    
    console.log(`\n测试 API: ${apiConfig.name} (${apiKey})`);
    console.log(`URL: ${apiConfig.api}`);
    
    try {
        // 1. 连通性测试
        console.log('  - 测试连通性...');
        const connectivityStart = Date.now();
        try {
            const connectivityResponse = await makeRequest(apiConfig.api, 5000);
            result.tests.connectivity.responseTime = Date.now() - connectivityStart;
            
            if (connectivityResponse.status === 200) {
                result.tests.connectivity.status = 'success';
                result.tests.connectivity.message = '连接成功';
            } else {
                result.tests.connectivity.status = 'warning';
                result.tests.connectivity.message = `HTTP ${connectivityResponse.status}`;
            }
        } catch (error) {
            result.tests.connectivity.responseTime = Date.now() - connectivityStart;
            result.tests.connectivity.status = 'failed';
            result.tests.connectivity.message = error.message;
        }
        
        // 2. 搜索功能测试
        console.log('  - 测试搜索功能...');
        const searchStart = Date.now();
        try {
            const searchUrl = `${apiConfig.api}?ac=videolist&wd=电影`;
            const searchResponse = await makeRequest(searchUrl, 8000);
            result.tests.search.responseTime = Date.now() - searchStart;
            
            if (searchResponse.status === 200 && searchResponse.data) {
                if (searchResponse.data.list && Array.isArray(searchResponse.data.list)) {
                    result.tests.search.status = 'success';
                    result.tests.search.resultCount = searchResponse.data.list.length;
                    result.tests.search.message = `搜索成功，返回 ${searchResponse.data.list.length} 条结果`;
                } else {
                    result.tests.search.status = 'warning';
                    result.tests.search.message = '搜索响应格式异常';
                }
            } else {
                result.tests.search.status = 'failed';
                result.tests.search.message = `搜索失败: HTTP ${searchResponse.status}`;
            }
        } catch (error) {
            result.tests.search.responseTime = Date.now() - searchStart;
            result.tests.search.status = 'failed';
            result.tests.search.message = `搜索错误: ${error.message}`;
        }
        
        // 3. 详情功能测试（如果搜索成功且有结果）
        if (result.tests.search.status === 'success' && result.tests.search.resultCount > 0) {
            console.log('  - 测试详情功能...');
            const detailStart = Date.now();
            try {
                // 使用搜索结果中的第一个ID进行详情测试
                const searchUrl = `${apiConfig.api}?ac=videolist&wd=电影`;
                const searchResponse = await makeRequest(searchUrl, 8000);
                
                if (searchResponse.data && searchResponse.data.list && searchResponse.data.list.length > 0) {
                    const firstItem = searchResponse.data.list[0];
                    const detailUrl = `${apiConfig.api}?ac=videolist&ids=${firstItem.vod_id}`;
                    const detailResponse = await makeRequest(detailUrl, 8000);
                    result.tests.detail.responseTime = Date.now() - detailStart;
                    
                    if (detailResponse.status === 200 && detailResponse.data) {
                        if (detailResponse.data.list && Array.isArray(detailResponse.data.list) && detailResponse.data.list.length > 0) {
                            const detailItem = detailResponse.data.list[0];
                            if (detailItem.vod_play_url) {
                                result.tests.detail.status = 'success';
                                result.tests.detail.message = '详情获取成功，包含播放链接';
                            } else {
                                result.tests.detail.status = 'warning';
                                result.tests.detail.message = '详情获取成功，但缺少播放链接';
                            }
                        } else {
                            result.tests.detail.status = 'warning';
                            result.tests.detail.message = '详情响应格式异常';
                        }
                    } else {
                        result.tests.detail.status = 'failed';
                        result.tests.detail.message = `详情获取失败: HTTP ${detailResponse.status}`;
                    }
                } else {
                    result.tests.detail.status = 'skipped';
                    result.tests.detail.message = '无法获取测试ID';
                }
            } catch (error) {
                result.tests.detail.responseTime = Date.now() - detailStart;
                result.tests.detail.status = 'failed';
                result.tests.detail.message = `详情错误: ${error.message}`;
            }
        } else {
            result.tests.detail.status = 'skipped';
            result.tests.detail.message = '搜索失败，跳过详情测试';
        }
        
        // 计算总体状态
        const successCount = Object.values(result.tests).filter(test => test.status === 'success').length;
        const failedCount = Object.values(result.tests).filter(test => test.status === 'failed').length;
        
        if (successCount >= 2) {
            result.overall = 'success';
            testResults.successfulAPIs++;
        } else if (failedCount >= 2) {
            result.overall = 'failed';
            testResults.failedAPIs++;
        } else {
            result.overall = 'warning';
        }
        
        console.log(`  结果: ${result.overall.toUpperCase()}`);
        
    } catch (error) {
        result.overall = 'failed';
        result.tests.connectivity.status = 'failed';
        result.tests.connectivity.message = error.message;
        testResults.failedAPIs++;
        console.log(`  结果: FAILED - ${error.message}`);
    }
    
    return result;
}

// 主测试函数
async function runAllTests() {
    console.log('='.repeat(60));
    console.log('开始全面API测试');
    console.log('='.repeat(60));
    
    const apiKeys = Object.keys(API_SITES).filter(key => key !== 'testSource'); // 排除测试源
    testResults.totalAPIs = apiKeys.length;
    
    console.log(`总共需要测试 ${apiKeys.length} 个API源`);
    
    for (const apiKey of apiKeys) {
        const apiConfig = API_SITES[apiKey];
        const result = await testAPI(apiKey, apiConfig);
        testResults.results.push(result);
        
        // 添加延迟避免请求过于频繁
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // 生成摘要
    testResults.summary = {
        successRate: ((testResults.successfulAPIs / testResults.totalAPIs) * 100).toFixed(2) + '%',
        averageResponseTime: {
            connectivity: 0,
            search: 0,
            detail: 0
        },
        categoryBreakdown: {
            success: testResults.successfulAPIs,
            failed: testResults.failedAPIs,
            warning: testResults.totalAPIs - testResults.successfulAPIs - testResults.failedAPIs
        }
    };
    
    // 计算平均响应时间
    const validResults = testResults.results.filter(r => r.overall !== 'failed');
    if (validResults.length > 0) {
        testResults.summary.averageResponseTime.connectivity = 
            Math.round(validResults.reduce((sum, r) => sum + r.tests.connectivity.responseTime, 0) / validResults.length);
        testResults.summary.averageResponseTime.search = 
            Math.round(validResults.reduce((sum, r) => sum + r.tests.search.responseTime, 0) / validResults.length);
        testResults.summary.averageResponseTime.detail = 
            Math.round(validResults.reduce((sum, r) => sum + r.tests.detail.responseTime, 0) / validResults.length);
    }
    
    // 保存测试结果
    const reportPath = path.join(__dirname, 'comprehensive-api-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2), 'utf8');
    
    // 输出测试摘要
    console.log('\n' + '='.repeat(60));
    console.log('测试完成摘要');
    console.log('='.repeat(60));
    console.log(`总测试API数: ${testResults.totalAPIs}`);
    console.log(`成功: ${testResults.successfulAPIs} (${testResults.summary.successRate})`);
    console.log(`失败: ${testResults.failedAPIs}`);
    console.log(`警告: ${testResults.summary.categoryBreakdown.warning}`);
    console.log(`\n平均响应时间:`);
    console.log(`  连通性: ${testResults.summary.averageResponseTime.connectivity}ms`);
    console.log(`  搜索: ${testResults.summary.averageResponseTime.search}ms`);
    console.log(`  详情: ${testResults.summary.averageResponseTime.detail}ms`);
    
    console.log(`\n详细报告已保存到: ${reportPath}`);
    
    // 输出失败的API
    const failedAPIs = testResults.results.filter(r => r.overall === 'failed');
    if (failedAPIs.length > 0) {
        console.log('\n失败的API:');
        failedAPIs.forEach(api => {
            console.log(`  - ${api.name} (${api.apiKey}): ${api.tests.connectivity.message}`);
        });
    }
    
    // 输出警告的API
    const warningAPIs = testResults.results.filter(r => r.overall === 'warning');
    if (warningAPIs.length > 0) {
        console.log('\n需要注意的API:');
        warningAPIs.forEach(api => {
            console.log(`  - ${api.name} (${api.apiKey})`);
            Object.entries(api.tests).forEach(([testType, test]) => {
                if (test.status === 'failed' || test.status === 'warning') {
                    console.log(`    ${testType}: ${test.message}`);
                }
            });
        });
    }
    
    console.log('\n='.repeat(60));
    
    return testResults;
}

// 运行测试
if (import.meta.url.endsWith('test-all-apis.js')) {
    runAllTests().catch(console.error);
}

export { runAllTests, testAPI };