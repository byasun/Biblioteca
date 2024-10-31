const express = require('express');
const rateLimit = require('express-rate-limit');
const emprestimoController = require('../controllers/emprestimoController');
const authMiddleware = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const cache = require('../middleware/cache');
const logger = require('../utils/logger');

const router = express.Router();

// Configuração de Limitadores de Taxa
const emprestimosLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Muitas tentativas de empréstimo. Tente novamente em 15 minutos.'
});

const renovacaoLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: 'Limite de renovações excedido. Tente novamente mais tarde.'
});

// Middleware de logging
router.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`, {
        userId: req.user?.id,
        body: req.body,
        params: req.params,
        query: req.query
    });
    next();
});

// Proteção de autenticação para todas as rotas
router.use(authMiddleware.protect);

// Rotas do Usuário
router.post('/', emprestimosLimiter, validate.emprestimo(), emprestimoController.realizarEmprestimo);
router.patch('/:emprestimoId/devolver', validate.params('emprestimoId'), emprestimoController.realizarDevolucao);
router.patch('/:emprestimoId/renovar', renovacaoLimiter, validate.params('emprestimoId'), emprestimoController.renovarEmprestimo);
router.get('/meus', cache(300), validate.queryParams(['status']), emprestimoController.listarEmprestimosUsuario);

// Rotas Administrativas
router.use(authMiddleware.restrictTo('admin'));
router.get('/', cache(60), validate.queryParams(['status', 'dataInicio', 'dataFim']), emprestimoController.listarEmprestimos);
router.get('/atrasados', cache(300), emprestimoController.listarEmprestimosAtrasados);
router.patch('/:emprestimoId/pagar-multa', validate.params('emprestimoId'), emprestimoController.pagarMulta);
router.get('/relatorio', cache(300), validate.queryParams(['dataInicio', 'dataFim']), emprestimoController.relatorioEmprestimos);

module.exports = router;
