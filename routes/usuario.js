const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Rota para cadastrar um novo usuário
router.post('/', async (req, res) => {
    const { matricula, nome, email, telefone } = req.body;

    const novoUsuario = new Usuario({ matricula, nome, email, telefone });

    try {
        const usuarioSalvo = await novoUsuario.save();
        res.status(201).json(usuarioSalvo);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Erro ao cadastrar usuário', error: error.message });
    }
});

// Rota para listar todos os usuários
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
});

module.exports = router;
