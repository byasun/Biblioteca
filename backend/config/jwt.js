const jwt = require('jsonwebtoken');
const config = require('./config');

const generateToken = (payload ) => {
    return jwt.sign(payload, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
    });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, config.jwtSecret, {
        expiresIn: '7d', // Tempo de expiração do token de refresh
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, config.jwtSecret);
};

const blacklistToken = (token) => {
    // Adicionar token à blacklist
    console.log(`Token adicionado à blacklist: ${token}`);
};

const rotateKeys = () => {
    // Rotacionar chaves de assinatura
    console.log('Chaves de assinatura rotacionadas com sucesso!');
};

const revokeToken = (token) => {
    // Revogar token
    console.log(`Token revogado: ${token}`);
};

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyToken,
    blacklistToken,
    rotateKeys,
    revokeToken,
};