const Usuario = require('../models/Usuario');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { enviarEmailConfirmacao } = require('../utils/email');

exports.listarUsuarios = catchAsync(async (req, res) => {
    const usuarios = await Usuario.find().select('-senha');

    res.status(200).json({
        status: 'success',
        results: usuarios.length,
        data: {
            usuarios
        }
    });
});

exports.criarUsuario = catchAsync(async (req, res) => {
    const usuario = await Usuario.create(req.body);

    // Envia email de confirmação
    await enviarEmailConfirmacao(usuario.email, {
        nome: usuario.nome,
        email: usuario.email
    });

    res.status(201).json({
        status: 'success',
        data: {
            usuario
        }
    });
});

exports.getUsuario = catchAsync(async (req, res) => {
    const usuario = await Usuario.findById(req.params.id).select('-senha');

    if (!usuario) {
        throw new AppError('Usuário não encontrado', 404);
    }

    res.status(200).json({
        status: 'success',
        data: {
            usuario
        }
    });
});

exports.atualizarUsuario = catchAsync(async (req, res) => {
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!usuario) {
        throw new AppError('Usuário não encontrado', 404);
    }

    res.status(200).json({
        status: 'success',
        data: {
            usuario
        }
    });
});

exports.deletarUsuario = catchAsync(async (req, res) => {
    await Usuario.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.buscarUsuario = catchAsync(async (req, res) => {
    const { nome, email } = req.query;
    const filtro = {};

    if (nome ) filtro.nome = { $regex: nome, $options: 'i' };
    if (email) filtro.email = email;

    const usuarios = await Usuario.find(filtro).select('-senha');

    res.status(200).json({
        status: 'success',
        results: usuarios.length,
        data: {
            usuarios
        }
    });
});

exports.notificarUsuario = catchAsync(async (req, res) => {
    const { usuarioId, mensagem } = req.body;

    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
        throw new AppError('Usuário não encontrado', 404);
    }

    // Envia notificação para o usuário
    await usuario.notificar(mensagem);

    res.status(200).json({
        status: 'success',
        data: {
            usuario
        }
    });
});

exports.login = catchAsync(async (req, res) => {
    const { email, senha } = req.body;
    // Adicione aqui a lógica de autenticação do usuário
    const usuario = await Usuario.findOne({ email });
    if (!usuario || !(await usuario.compararSenha(senha))) {
        throw new AppError('Credenciais inválidas', 401);
    }

    res.status(200).json({
        status: 'success',
        message: 'Login bem-sucedido',
        data: { usuario }
    });
});
