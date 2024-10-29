const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const rateLimiter = require('../middleware/rateLimiter');
const sanitize = require('../middleware/sanitize');

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticar um usuário
 *     tags: [Autenticação]
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
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login',
    rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }),
    [
        body('email').isEmail().normalizeEmail(),
        body('senha').isLength({ min: 6 })
    ],
    validate,
    sanitize,
    authController.login
);

/**
 * @swagger
 * /api/auth/registro:
 *   post:
 *     summary: Registrar um novo usuário
 *     tags: [Autenticação]
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
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/registro',
    [
        body('nome').isLength({ min: 2 }).trim().escape(),
        body('email').isEmail().normalizeEmail(),
        body('senha').isLength({ min: 6 })
    ],
    validate,
    sanitize,
    authController.registro
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Fazer logout do usuário
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Logout bem-sucedido
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /api/auth/esqueci-senha:
 *   post:
 *     summary: Solicitar redefinição de senha
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email de redefinição enviado
 */
router.post('/esqueci-senha',
    [body('email').isEmail().normalizeEmail()],
    validate,
    authController.esqueciSenha
);

/**
 * @swagger
 * /api/auth/redefinir-senha/{token}:
 *   post:
 *     summary: Redefinir senha
 *     tags: [Autenticação]
 *     parameters:
 *       - in: path
 *         name: token
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
 *               - senha
 *             properties:
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 */
router.post('/redefinir-senha/:token',
    [body('senha').isLength({ min: 6 })],
    validate,
    authController.redefinirSenha
);

/**
 * @swagger
 * /api/auth/verificar-email/{token}:
 *   get:
 *     summary: Verificar email do usuário
 *     tags: [Autenticação]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verificado com sucesso
 */
router.get('/verificar-email/:token', authController.verificarEmail);

module.exports = router;