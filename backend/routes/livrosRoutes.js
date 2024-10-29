const express = require('express');
const livroController = require('../controllers/livroController');
const authMiddleware = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const cache = require('../middleware/cache');
const upload = require('../utils/multer');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate Limiter para criação de livros
const criarLivroLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 10, // limite de 10 livros por IP por hora
    message: 'Muitos livros criados a partir deste IP, tente novamente após uma hora'
});

/**
 * @swagger
 * /api/livros:
 *   get:
 *     summary: Listar todos os livros
 *     tags: [Livros]
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
 *         description: Lista de livros retornada com sucesso
 */
router.get('/',
    cache(300), // Cache de 5 minutos
    validate.queryParams(['page', 'limit', 'sort']),
    livroController.listarLivros
);

/**
 * @swagger
 * /api/livros/{id}:
 *   get:
 *     summary: Obter detalhes de um livro específico
 *     tags: [Livros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do livro retornados com sucesso
 *       404:
 *         description: Livro não encontrado
 */
router.get('/:id',
    cache(300), // Cache de 5 minutos
    validate.params('id'),
    livroController.getLivro
);

// Rotas protegidas - requer autenticação
router.use(authMiddleware.protect);

/**
 * @swagger
 * /api/livros/{id}/avaliacoes:
 *   post:
 *     summary: Adicionar avaliação a um livro
 *     tags: [Livros]
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
 *               - nota
 *               - comentario
 *             properties:
 *               nota:
 *                 type: number
 *               comentario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Avaliação adicionada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Livro não encontrado
 */
router.post('/:id/avaliacoes',
    validate.params('id'),
    validate.avaliacao(),
    livroController.adicionarAvaliacao
);

// Rotas apenas para administradores
router.use(authMiddleware.restrictTo('admin'));

/**
 * @swagger
 * /api/livros:
 *   post:
 *     summary: Criar um novo livro (apenas admin)
 *     tags: [Livros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - autor
 *               - isbn
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               isbn:
 *                 type: string
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Livro criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/',
    criarLivroLimiter,
    upload.single('imagem'),
    validate.criarLivro(),
    livroController.criarLivro
);

/**
 * @swagger
 * /api/livros/{id}:
 *   patch:
 *     summary: Atualizar um livro (apenas admin)
 *     tags: [Livros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               isbn:
 *                 type: string
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Livro não encontrado
 */
router.patch('/:id',
    validate.params('id'),
    upload.single('imagem'),
    validate.atualizarLivro(),
    livroController.atualizarLivro
);

/**
 * @swagger
 * /api/livros/{id}:
 *   delete:
 *     summary: Deletar um livro (apenas admin)
 *     tags: [Livros]
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
 *         description: Livro deletado com sucesso
 *       404:
 *         description: Livro não encontrado
 */
router.delete('/:id',
     validate.params('id'),
     livroController.deletarLivro
);

module.exports = router;