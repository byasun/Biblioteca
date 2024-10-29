const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const rateLimit = require('express-rate-limit');
const cache = require('../middleware/cache');

const router = express.Router();

// Rate Limiters
const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 5, // limite de 5 contas por IP por hora
    message: 'Muitas contas criadas a partir deste IP, tente novamente após uma hora'
});

const updateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // limite de 10 atualizações por IP
    message: 'Muitas tentativas de atualização, tente novamente após 15 minutos'
});

/**
 * @swagger
 * /api/usuarios/registrar:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/registrar', 
    createAccountLimiter,
    validate.registroUsuario(),
    usuarioController.registrar
);

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login',
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 5,
        message: 'Muitas tentativas de login, tente novamente após 15 minutos'
    }),
    validate.login(),
    usuarioController.login
);

// Rotas protegidas - requer autenticação
router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/usuarios/perfil:
 *   get:
 *     summary: Obter perfil do usuário logado
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtido com sucesso
 *       401:
 *         description: Não autorizado
 */
router.get('/perfil',
    cache(300), // Cache de 5 minutos
    usuarioController.getUsuario
);

/**
 * @swagger
 * /api/usuarios/atualizar:
 *   patch:
 *     summary: Atualizar dados do usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dados atualizados com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.patch('/atualizar',
    updateLimiter,
    validate.atualizacaoUsuario(),
    usuarioController.atualizarUsuario
);

// Rotas administrativas
router.use(authMiddleware.restrictTo('admin'));

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Listar todos os usuários (apenas admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *       403:
 *         description: Acesso negado
 */
router.get('/',
    cache(60), // Cache de 1 minuto
    validate.queryParams(['page', 'limit', 'sort']),
    usuarioController.listarUsuarios
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Deletar usuário (apenas admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id',
    validate.params('id'),
    usuarioController.deletarUsuario
);

/**
 * @swagger
 * /api/usuarios/buscar:
 *   get:
 *     summary: Buscar usuários por critérios (apenas admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resultados da busca
 */
router.get('/buscar',
    cache(60),
    validate.queryParams(['nome', 'email']),
    usuarioController.buscarUsuario
);

/**
 * @swagger
 * /api/usuarios/{id}/notificar:
 *   post:
 *     summary: Enviar notificação para usuário (apenas admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mensagem
 *             properties:
 *               mensagem:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notificação enviada com suc ce
 */
router.post('/:id/notificar',
    validate.params('id'),
    validate.notificacao(),
    usuarioController.notificarUsuario
);

module.exports = router;