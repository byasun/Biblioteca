const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const rateLimiter = require('../middleware/rateLimiter');
const sanitize = require('../middleware/sanitize');

const router = express.Router();

// Validações comuns
const loginValidation = [
    body('email').isEmail().normalizeEmail(),
    body('senha').isLength({ min: 6 })
];

const registroValidation = [
    body('nome').isLength({ min: 2 }).trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('senha').isLength({ min: 6 })
];

const resetPasswordValidation = [
    body('senha').isLength({ min: 6 })
];

// Rotas
router.post('/login', rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }), loginValidation, validate, sanitize, authController.login);
router.post('/registro', registroValidation, validate, sanitize, authController.registro);
router.post('/logout', authController.logout);
router.post('/esqueci-senha', [body('email').isEmail().normalizeEmail()], validate, authController.esqueciSenha);
router.post('/redefinir-senha/:token', resetPasswordValidation, validate, authController.redefinirSenha);
router.get('/verificar-email/:token', authController.verificarEmail);

module.exports = router;
