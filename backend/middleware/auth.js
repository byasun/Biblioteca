const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Usuario = require('../models/Usuario');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Você não está logado. Por favor, faça login para ter acesso.', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const usuarioAtual = await Usuario.findById(decoded.id);
    if (!usuarioAtual) {
        return next(new AppError('O usuário deste token não existe mais.', 401));
    }

    req.user = usuarioAtual;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('Você não tem permissão para realizar esta ação', 403));
        }
        next();
    };
};

exports.refreshToken = catchAsync(async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new AppError('Refresh token não fornecido', 401));
    }

    const decoded = await promisify(jwt.verify)(refreshToken, process.env.JWT_SECRET);

    const usuarioAtual = await Usuario.findById(decoded.id);
    if (!usuarioAtual) {
        return next(new AppError('Usuário não encontrado', 401));
    }

    const newToken = jwt.sign({ id: usuarioAtual._id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });

    res.status(200).json({
        status: 'success',
        token: newToken
    });
});