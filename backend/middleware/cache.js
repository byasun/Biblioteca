const NodeCache = require('node-cache');
const cache = new NodeCache({
    stdTTL: 600, // Tempo padrão de cache (10 minutos)
    checkperiod: 120 // Verifica itens expirados a cada 2 minutos
});

module.exports = (duration) => {
    return (req, res, next) => {
        if (req.headers['x-bypass-cache'] || req.method !== 'GET') {
            return next();
        }

        const key = `${req.originalUrl}-${JSON.stringify(req.query)}`;
        const cachedResponse = cache.get(key);

        if (cachedResponse) {
            res.set('X-Cache', 'HIT');
            return res.json(cachedResponse);
        }

        res.set('X-Cache', 'MISS');

        const originalJson = res.json.bind(res);
        res.json = (body) => {
            if (res.statusCode === 200) {
                cache.set(key, body, duration);
            }
            return originalJson(body);
        };

        next();
    };
};

module.exports.clearCache = (key) => {
    if (key) {
        cache.del(key);
    } else {
        cache.flushAll();
    }
};

module.exports.getCacheStats = () => {
    return {
        keys: cache.keys(),
        stats: cache.getStats()
    };
};
