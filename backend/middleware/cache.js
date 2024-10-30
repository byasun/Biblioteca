// backend/middleware/cache.js

const NodeCache = require('node-cache');
const cache = new NodeCache({
    stdTTL: 600, // Tempo padrão de cache (10 minutos)
    checkperiod: 120 // Verifica itens expirados a cada 2 minutos
});

module.exports = (duration) => {
    return (req, res, next) => {
        // Pula cache se estiver desabilitado via header
        if (req.headers['x-bypass-cache']) {
            return next();
        }

        // Pula cache para métodos não-GET
        if (req.method !== 'GET') {
            return next();
        }

        // Cria uma chave única baseada na URL e query params
        const key = `${req.originalUrl}-${JSON.stringify(req.query)}`;
        const cachedResponse = cache.get(key);

        if (cachedResponse) {
            // Adiciona header indicando hit no cache
            res.set('X-Cache', 'HIT');
            return res.json(cachedResponse);
        }

        res.set('X-Cache', 'MISS');

        // Modifica o res.json() para armazenar a resposta no cache
        const originalJson = res.json;
        res.json = function(body) {
            if (res.statusCode === 200) {
                cache.set(key, body, duration);
            }
            originalJson.call(this, body);
        };

        next();
    };
};

// Métodos auxiliares para gerenciamento do cache
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