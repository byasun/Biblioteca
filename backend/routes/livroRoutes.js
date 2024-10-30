const express = require('express');
const livroController = require('../controllers/livroController');
const authMiddleware = require('../middleware/auth');
const validator = require('../middleware/validator');
const rateLimit = require('express-rate-limit');
const cache = require('../middleware/cache');
const upload = require('../middleware/upload');

const router = express.Router();

// Rate Limiter para criação de livros
const criarLivroLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 10, // limite de 10 livros por IP por hora
    message: 'Muitos livros criados a partir deste IP, tente novamente após uma hora'
});

router.get('/',
    cache(300), // Cache de 5 minutos
    validator.queryParams(['page', 'limit', 'sort']), // Validação correta
    livroController.listarLivros
);

router.get('/:id',
    cache(300), // Cache de 5 minutos
    validator.params(['id']), // Verifica se 'id' é um parâmetro válido
    livroController.getLivro
);

// Rotas protegidas - requer autenticação
router.use(authMiddleware.protect);

router.post('/:id/avaliacoes',
    validator.params(['id']), // Verifica se 'id' é um parâmetro válido
    validator.validateLivro, // Valida a avaliação, ajuste conforme sua implementação
    livroController.avaliarLivro
);

// Rotas apenas para administradores
router.use(authMiddleware.restrictTo('admin'));

router.post('/',
    criarLivroLimiter,
    upload.single('imagem'),
    validator.validateLivro, // Validação do corpo do livro
    livroController.criarLivro
);

router.patch('/:id',
    validator.params(['id']), // Verifica se 'id' é um parâmetro válido
    upload.single('imagem'),
    validator.validateLivro, // Validação do corpo do livro
    livroController.atualizarLivro
);

router.delete('/:id',
    validator.params(['id']), // Verifica se 'id' é um parâmetro válido
    livroController.deletarLivro
);

module.exports = router;
