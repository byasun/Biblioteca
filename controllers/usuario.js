// controllers/usuario.js
const Usuario = require('../models/Usuario'); // Verifique o nome do arquivo e ajuste se necessário

exports.cadastrarUsuario = async (req, res) => {
    try {
        const novoUsuario = new Usuario(req.body);
        await novoUsuario.save();
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
    } catch (err) {
        res.status(400).json({ message: `Erro ao cadastrar o usuário: ${err.message}` });
    }
};

exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (err) {
        res.status(500).json({ message: `Erro ao listar os usuários: ${err.message}` });
    }
};
