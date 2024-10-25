// routes/usuario.js

const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario');

// Rota para cadastrar um novo usuário
router.post('/', usuarioController.cadastrarUsuario);

// Rota para listar todos os usuários
router.get('/', usuarioController.listarUsuarios);

module.exports = router;
