require('dotenv').config();

module.exports = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: '24h',
    loginAttemptLimit: 5, // Limite de tentativas de login
    cacheConfig: {
        enabled: true,
        ttl: 3600,
    }
};
