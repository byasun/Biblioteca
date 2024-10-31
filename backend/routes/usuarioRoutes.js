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

// Rota para registrar um novo usuário com limite de criação
router.post('/registrar', 
    createAccountLimiter, 
    validate.registroUsuario, 
    usuarioController.criarUsuario
);

// Rota para login com limite de tentativas
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

// Rota para obter perfil do usuário logado com cache de 5 minutos
router.get('/perfil', 
    cache(300), 
    usuarioController.getUsuario
);

// Rotas administrativas - requer privilégios de administrador
router.use(authMiddleware.restrictTo('admin'));

// Rota para listar usuários com cache e validação de parâmetros
router.get('/', 
    cache(60), 
    validate.queryParams(['page', 'limit', 'sort']), 
    usuarioController.listarUsuarios
);

// Rota para deletar um usuário específico
router.delete('/:id', 
    validate.params('id'), 
    usuarioController.deletarUsuario
);

module.exports = router;
