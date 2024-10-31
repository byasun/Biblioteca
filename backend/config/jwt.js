const jwt = require('jsonwebtoken');
const config = require('./config');

const generateToken = (payload) => {
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

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyToken,
};
