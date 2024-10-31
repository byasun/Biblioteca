const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validator');
const rateLimit = require('express-rate-limit');
const cache = require('../middleware/cache');

const router = express.Router();

// Rate Limiters
const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 5, // limite de 5 contas por IP por hora
    message: 'Muitas contas criadas a partir deste IP, tente novamente após uma hora',
});

const updateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // limite de 10 atualizações por IP
    message: 'Muitas tentativas de atualização, tente novamente após 15 minutos',
});

// Rotas públicas
router.post('/registrar', 
    createAccountLimiter, 
    validate.registroUsuario, 
    usuarioController.criarUsuario
);

router.post('/login', 
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 5,
        message: 'Muitas tentativas de login, tente novamente após 15 minutos'
    }), 
    validate.login, 
    usuarioController.login
);

// Rotas protegidas - requer autenticação
router.use(authMiddleware.protect);

// Rotas de usuário
router.get('/perfil', 
    cache(300), // Cache de 5 minutos
    usuarioController.getUsuario
);

// Rotas administrativas
router.use(authMiddleware.restrictTo('admin'));

// Listar, deletar e buscar usuários
router.get('/', 
    cache(60), // Cache de 1 minuto
    validate.queryParams(['page', 'limit', 'sort']), 
    usuarioController.listarUsuarios
);

router.delete('/:id', 
    validate.params('id'), 
    usuarioController.deletarUsuario
);

router.get('/buscar', 
    cache(60), 
    validate.queryParams(['nome', 'email']), 
    usuarioController.buscarUsuario
);

module.exports = router;
