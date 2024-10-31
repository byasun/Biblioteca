const Usuario = require('../models/Usuario');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.listarUsuarios = catchAsync(async (req, res) => {
    const usuarios = await Usuario.find().select('-senha');
    res.status(200).json({
        status: 'success',
        results: usuarios.length,
        data: { usuarios }
    });
});

exports.criarUsuario = catchAsync(async (req, res) => {
    const usuario = await Usuario.create(req.body);
    res.status(201).json({
        status: 'success',
        data: { usuario }
    });
});

exports.getUsuario = catchAsync(async (req, res) => {
    const usuario = await Usuario.findById(req.params.id).select('-senha');
    if (!usuario) throw new AppError('Usuário não encontrado', 404);

    res.status(200).json({
        status: 'success',
        data: { usuario }
    });
});

exports.atualizarUsuario = catchAsync(async (req, res) => {
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!usuario) throw new AppError('Usuário não encontrado', 404);

    res.status(200).json({
        status: 'success',
        data: { usuario }
    });
});

exports.deletarUsuario = catchAsync(async (req, res) => {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) throw new AppError('Usuário não encontrado', 404);

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.buscarUsuario = catchAsync(async (req, res) => {
    const filtro = {
        ...(req.query.nome && { nome: { $regex: req.query.nome, $options: 'i' } }),
        ...(req.query.email && { email: req.query.email })
    };
    const usuarios = await Usuario.find(filtro).select('-senha');

    res.status(200).json({
        status: 'success',
        results: usuarios.length,
        data: { usuarios }
    });
});

exports.login = catchAsync(async (req, res) => {
    const { email, senha } = req.body;
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
