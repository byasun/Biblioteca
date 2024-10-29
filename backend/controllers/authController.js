const Usuario = require('../models/Usuario');
const { generateToken, generateRefreshToken, blacklistToken } = require('../config/jwt');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const emailService = require('../config/email');
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

    // Resetar tentativas de login após sucesso
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

    // Gerar token de verificação
    const verificationToken = novoUsuario.criarTokenVerificacaoEmail();
    await novoUsuario.save();

    // Enviar email de verificação
    const verificationURL = `${req.protocol}://${req.get('host')}/api/v1/usuarios/verificarEmail/${verificationToken}`;
    await emailService.queueEmail(novoUsuario.email, 'verificacaoEmail', { nome: novoUsuario.nome, verificationURL });

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
    const { token } = req.params;

    const usuario = await Usuario.findOne({
        tokenVerificacaoEmail: token,
        tokenVerificacaoEmailExpiracao: { $gt: Date.now() }
    });

    if (!usuario) {
        return next(new AppError('Token inválido ou expirado', 400));
    }

    usuario.emailVerificado = true;
    usuario.tokenVerificacaoEmail = undefined;
    usuario.tokenVerificacaoEmailExpiracao = undefined;
    await usuario.save();

    res.status(200).json({
        status: 'success',
        message: 'Email verificado com sucesso'
    });
});

exports.esqueciSenha = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
        return next(new AppError('Não há usuário com este endereço de email', 404));
    }

    const resetToken = usuario.criarTokenResetSenha();
    await usuario.save();

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/usuarios/resetarSenha/${resetToken}`;
    
    await emailService.queueEmail(usuario.email, 'recuperacaoSenha', { 
        nomeUsuario: usuario.nome, 
        resetLink: resetURL 
    });

    res.status(200).json({
        status: 'success',
        message: 'Token enviado para o email'
    });
});

exports.resetarSenha = catchAsync(async (req, res, next) => {
    const { token } = req.params;
    const { senha } = req.body;

    const usuario = await Usuario.findOne({
        tokenResetSenha: crypto.createHash('sha256').update(token).digest('hex'),
        tokenResetSenhaExpiracao: { $gt: Date.now() }
    });

    if (!usuario) {
        return next(new AppError('Token inválido ou expirado', 400));
    }

    usuario.senha = senha;
    usuario.tokenResetSenha = undefined;
    usuario.tokenResetSenhaExpiracao = undefined;
    await usuario.save();

    const jwtToken = generateToken({ id: usuario._id });

    res.status(200).json({
        status: 'success',
        token: jwtToken
    });
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
    // Adicionar o token atual à blacklist
    blacklistToken(req.token);

    res.status(200).json({
        status: 'success',
        message: 'Logout realizado com sucesso'
    });
});