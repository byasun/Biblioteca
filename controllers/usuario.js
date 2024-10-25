// controllers/usuario.js

const Usuario = require('../models/usuario');

// Controlador para cadastrar um novo usuário
exports.cadastrarUsuario = async (req, res) => {
    try {
        const novoUsuario = new Usuario(req.body);
        await novoUsuario.save();
        res.status(201).send('Usuário cadastrado com sucesso!');
    } catch (err) {
        res.status(400).send('Erro ao cadastrar o usuário: ' + err.message);
    }
};

// Controlador para listar os usuários
exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (err) {
        res.status(400).send('Erro ao listar os usuários: ' + err.message);
    }
};
