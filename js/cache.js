// 搜索结果缓存管理
class SearchCache {
    constructor() {
        this.cache = new Map();
        this.maxSize = 50; // 最大缓存条目数
        this.ttl = 5 * 60 * 1000; // 缓存有效期：5分钟
        this.cleanupInterval = 60 * 1000; // 清理间隔：1分钟
        
        // 定期清理过期缓存
        setInterval(() => this.cleanup(), this.cleanupInterval);
    }
    
    // 生成缓存键
    generateKey(query, apiIds) {
        const sortedApiIds = Array.isArray(apiIds) ? apiIds.sort().join(',') : apiIds;
        return `${query.toLowerCase().trim()}_${sortedApiIds}`;
    }
    
    // 获取缓存
    get(query, apiIds) {
        const key = this.generateKey(query, apiIds);
        const cached = this.cache.get(key);
        
        if (!cached) {
            return null;
        }
        
        // 检查是否过期
        if (Date.now() - cached.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        // 更新访问时间
        cached.lastAccess = Date.now();
        return cached.data;
    }
    
    // 设置缓存
    set(query, apiIds, data) {
        const key = this.generateKey(query, apiIds);
        
        // 如果缓存已满，删除最旧的条目
        if (this.cache.size >= this.maxSize) {
            this.evictOldest();
        }
        
        this.cache.set(key, {
            data: data,
            timestamp: Date.now(),
            lastAccess: Date.now()
        });
    }
    
    // 删除最旧的缓存条目
    evictOldest() {
        let oldestKey = null;
        let oldestTime = Date.now();
        
        for (const [key, value] of this.cache.entries()) {
            if (value.lastAccess < oldestTime) {
                oldestTime = value.lastAccess;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            this.cache.delete(oldestKey);
        }
    }
    
    // 清理过期缓存
    cleanup() {
        const now = Date.now();
        const keysToDelete = [];
        
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > this.ttl) {
                keysToDelete.push(key);
            }
        }
        
        keysToDelete.forEach(key => this.cache.delete(key));
        
        if (keysToDelete.length > 0) {
            console.log(`清理了 ${keysToDelete.length} 个过期缓存条目`);
        }
    }
    
    // 清空所有缓存
    clear() {
        this.cache.clear();
    }
    
    // 获取缓存统计信息
    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            ttl: this.ttl
        };
    }
}

// 创建全局缓存实例
const searchCache = new SearchCache();

// 导出到全局
window.searchCache = searchCache;