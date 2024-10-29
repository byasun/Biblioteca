const express = require('express');
const rateLimit = require('express-rate-limit');
const emprestimoController = require('../controllers/emprestimoController');
const authMiddleware = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const cache = require('../middleware/cache');
const logger = require('../utils/logger');

const router = express.Router();

// Rate Limiters
const emprestimosLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // limite de 10 empréstimos por IP
    message: 'Muitas tentativas de empréstimo. Tente novamente em 15 minutos.'
});

const renovacaoLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 3, // limite de 3 renovações por IP
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

/**
 * @swagger
 * /api/emprestimos:
 *   post:
 *     summary: Realizar um novo empréstimo
 *     tags: [Empréstimos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - livroId
 *             properties:
 *               livroId:
 *                 type: string
 *                 description: ID do livro a ser emprestado
 *     responses:
 *       201:
 *         description: Empréstimo realizado com sucesso
 *       400:
 *         description: Dados inválidos ou livro indisponível
 *       401:
 *         description: Não autorizado
 *       429:
 *         description: Muitas tentativas de empréstimo
 */
router.post('/', 
    emprestimosLimiter,
    validate.emprestimo(),
    emprestimoController.realizarEmprestimo
);

/**
 * @swagger
 * /api/emprestimos/{emprestimoId}/devolver:
 *   patch:
 *     summary: Realizar devolução de livro
 *     tags: [Empréstimos]
 *     parameters:
 *       - in: path
 *         name: emprestimoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Devolução realizada com sucesso
 *       404:
 *         description: Empréstimo não encontrado
 */
router.patch('/:emprestimoId/devolver',
    validate.params('emprestimoId'),
    emprestimoController.realizarDevolucao
);

/**
 * @swagger
 * /api/emprestimos/{emprestimoId}/renovar:
 *   patch:
 *     summary: Renovar empréstimo
 *     tags: [Empréstimos]
 *     parameters:
 *       - in: path
 *         name: emprestimoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Renovação realizada com sucesso
 *       400:
 *         description: Não é possível renovar (atrasado ou limite atingido)
 *       404:
 *         description: Empréstimo não encontrado
 */
router.patch('/:emprestimoId/renovar',
    renovacaoLimiter,
    validate.params('emprestimoId'),
    emprestimoController.renovarEmprestimo
);

/**
 * @swagger
 * /api/emprestimos/meus:
 *   get:
 *     summary: Listar empréstimos do usuário logado
 *     tags: [Empréstimos]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ATIVO, DEVOLVIDO, ATRASADO]
 *     responses:
 *       200:
 *         description: Lista de empréstimos retornada com sucesso
 */
router.get('/meus', 
    cache(300), // Cache de 5 minutos
    validate.queryParams(['status']),
    emprestimoController.listarEmprestimosUsuario
);

// Rotas administrativas
router.use(authMiddleware.restrictTo('admin'));

/**
 * @swagger
 * /api/emprestimos:
 *   get:
 *     summary: Listar todos os empréstimos (apenas admin)
 *     tags: [Empréstimos]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista de empréstimos retornada com sucesso
 *       403:
 *         description: Acesso negado
 */
router.get('/', 
    cache(60), // Cache de 1 minuto
    validate.queryParams(['status', 'dataInicio', 'dataFim']),
    emprestimoController.listarEmprestimos
);

/**
 * @swagger
 * /api/emprestimos/atrasados:
 *   get:
 *     summary: Listar empréstimos atrasados (apenas admin)
 *     tags: [Empréstimos]
 *     responses:
 *       200:
 *         description: Lista de empréstimos atrasados
 *       403:
 *         description: Acesso negado
 */
router.get('/atrasados',
    cache(300), // Cache de 5 minutos
    emprestimoController.listarEmprestimosAtrasados
);

/**
 * @swagger
 * /api/emprestimos/{emprestimoId}/pagar-multa:
 *   patch:
 *     summary: Registrar pagamento de multa (apenas admin)
 *     tags: [Empréstimos]
 *     parameters:
 *       - in: path
 *         name: emprestimoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Multa registrada como paga
 *       404:
 *         description: Empréstimo não encontrado
 */
router.patch('/:emprestimoId/pagar-multa',
    validate.params('emprestimoId'),
    emprestimoController.pagarMulta
);

/**
 * @swagger
 * /api/emprestimos/relatorio:
 *   get:
 *     summary: Gerar relatório de empréstimos (apenas admin)
 *     tags: [Empréstimos]
 *     parameters:
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
  *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 *       403:
 *         description: Acesso negado
 */
router.get('/relatorio',
    cache(300), // Cache de 5 minutos
    validate.queryParams(['dataInicio', 'dataFim']),
    emprestimoController.relatorioEmprestimos
);

module.exports = router;