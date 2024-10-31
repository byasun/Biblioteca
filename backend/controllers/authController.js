const Usuario = require('../models/Usuario');
const { generateToken, generateRefreshToken, blacklistToken } = require('../config/jwt');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const crypto = require('crypto');

exports.login = catchAsync(async (req, res, next) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return next(new AppError('Por favor, forneça email e senha', 400));
    }

    const usuario = await Usuario.findOne({ email }).select('+senha +tentativasLogin');

    if (!usuario || !(await usuario.compararSenha(senha))) {
        usuario.tentativasLogin.count += 1;
        usuario.tentativasLogin.lastAttempt = Date.now();
        await usuario.save();

        if (usuario.tentativasLogin.count >= 5) {
            await usuario.bloquearConta();
            return next(new AppError('Conta bloqueada. Por favor, contate o suporte.', 401));
        }

        return next(new AppError('Email ou senha incorretos', 401));
    }

    usuario.tentativasLogin.count = 0;
    usuario.tentativasLogin.lastAttempt = null;
    await usuario.save();

    const token = generateToken({ id: usuario._id });
    const refreshToken = generateRefreshToken({ id: usuario._id });

    res.status(200).json({
        status: 'success',
        token,
        refreshToken,
        data: {
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email
            }
        }
    });
});

exports.registro = catchAsync(async (req, res, next) => {
    const { nome, email, senha, matricula } = req.body;

    const novoUsuario = await Usuario.create({
        nome,
        email,
        senha,
        matricula
    });

    const token = generateToken({ id: novoUsuario._id });

    res.status(201).json({
        status: 'success',
        token,
        data: {
            usuario: {
                id: novoUsuario._id,
                nome: novoUsuario.nome,
                email: novoUsuario.email
            }
        }
    });
});

exports.verificarEmail = catchAsync(async (req, res, next) => {
    return next(new AppError('A verificação de e-mail foi desativada', 400));
});

exports.esqueciSenha = catchAsync(async (req, res, next) => {
    return next(new AppError('A funcionalidade de recuperação de senha foi desativada', 400));
});

exports.resetarSenha = catchAsync(async (req, res, next) => {
    return next(new AppError('A funcionalidade de redefinição de senha foi desativada', 400));
});

exports.atualizarSenha = catchAsync(async (req, res, next) => {
    const { senhaAtual, novaSenha } = req.body;
    const usuario = await Usuario.findById(req.user.id).select('+senha');

    if (!(await usuario.compararSenha(senhaAtual))) {
        return next(new AppError('Sua senha atual está incorreta', 401));
    }

    usuario.senha = novaSenha;
    await usuario.save();

    const token = generateToken({ id: usuario._id });

    res.status(200).json({
        status: 'success',
        token,
        message: 'Senha atualizada com sucesso'
    });
});

exports.logout = catchAsync(async (req, res) => {
    blacklistToken(req.token);

    res.status(200).json({
        status: 'success',
        message: 'Logout realizado com sucesso'
    });
});
