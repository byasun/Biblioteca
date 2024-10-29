require('dotenv').config();

module.exports = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: '24h',
    resetTokenExpiresIn: '1h', 
    loginAttemptLimit: 5, // Limite de tentativas de login
    uploadConfig: {
        maxFileSize: 5 * 1024 * 1024, // Limite de 5 MB para uploads
        allowedFormats: ['image/jpeg', 'image/png', 'application/pdf'], // Formatos permitidos
    },
    cacheConfig: {
        enabled: true, 
        ttl: 3600,
    },
    emailConfig: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
};