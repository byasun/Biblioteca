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

// Rotas públicas
router.get('/', 
    cache(300), // Cache de 5 minutos
    validator.queryParams(['page', 'limit', 'sort']), 
    livroController.listarLivros
);

router.get('/:id', 
    cache(300), 
    validator.params(['id']), 
    livroController.getLivro
);

// Rotas protegidas - requer autenticação
router.use(authMiddleware.protect);

// Avaliar livro
router.post('/:id/avaliacoes', 
    validator.params(['id']), 
    validator.validateLivro, 
    livroController.avaliarLivro
);

// Rotas administrativas
router.use(authMiddleware.restrictTo('admin'));

// Criação, atualização e exclusão de livros
router.post('/', 
    criarLivroLimiter, 
    upload.single('imagem'), 
    validator.validateLivro, 
    livroController.criarLivro
);

router.patch('/:id', 
    validator.params(['id']), 
    upload.single('imagem'), 
    validator.validateLivro, 
    livroController.atualizarLivro
);

router.delete('/:id', 
    validator.params(['id']), 
    livroController.deletarLivro
);

module.exports = router;
