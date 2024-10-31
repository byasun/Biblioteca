const { body, validationResult } = require('express-validator');

// Padrões de regex para validações
const PATTERNS = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    telefone: /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/,
    nome: /^[a-zA-ZÀ-ÿ\s]{2,}$/,
    matricula: /^[0-9]{4,10}$/,
    isbn: /^(97(8|9))?\d{9}(\d|X)$/,
};

// Mensagens de erro
const MENSAGENS_ERRO = {
    required: campo => `O campo ${campo} é obrigatório!`,
    invalid: campo => `O campo ${campo} está em formato inválido!`,
    minLength: (campo, min) => `O campo ${campo} deve ter no mínimo ${min} caracteres!`,
    emailInvalido: 'Por favor, insira um email válido!',
    matriculaInvalida: 'A matrícula deve conter apenas números e ter entre 4 e 10 dígitos!',
    isbnInvalido: 'O ISBN deve estar em um formato válido!',
};

// Função para lidar com erros de validação
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Middleware de validação para registro de usuário
const registroUsuario = [
    body('nome').trim().notEmpty().withMessage(MENSAGENS_ERRO.required('nome')),
    body('email').trim().isEmail().withMessage(MENSAGENS_ERRO.emailInvalido),
    body('senha').trim().isLength({ min: 6 }).withMessage(MENSAGENS_ERRO.minLength('senha', 6)),
    body('matricula').trim().matches(PATTERNS.matricula).withMessage(MENSAGENS_ERRO.matriculaInvalida),
    handleValidationErrors
];

// Middleware de validação para login de usuário
const login = [
    body('email').trim().isEmail().withMessage(MENSAGENS_ERRO.emailInvalido),
    body('senha').trim().isLength({ min: 6 }).withMessage(MENSAGENS_ERRO.minLength('senha', 6)),
    handleValidationErrors
];

// Middleware de validação para livro
const validateLivro = [
    body('titulo').trim().notEmpty().withMessage(MENSAGENS_ERRO.required('título')),
    body('autor').trim().notEmpty().withMessage(MENSAGENS_ERRO.required('autor')),
    body('isbn').optional().matches(PATTERNS.isbn).withMessage(MENSAGENS_ERRO.isbnInvalido),
    handleValidationErrors
];

// Função para validar parâmetros de query
const queryParams = (validParams) => (req, res, next) => {
    const invalidParams = Object.keys(req.query).filter(param => !validParams.includes(param));
    if (invalidParams.length > 0) {
        return res.status(400).json({
            status: 'fail',
            message: `Parâmetros inválidos: ${invalidParams.join(', ')}`
        });
    }
    next();
};

// Função para validar parâmetros de rota
const params = (param) => (req, res, next) => {
    if (!req.params[param]) {
        return res.status(400).json({
            status: 'fail',
            message: `Parâmetro ${param} é obrigatório!`
        });
    }
    next();
};

module.exports = {
    registroUsuario,
    login,
    validateLivro,
    queryParams,
    params,
};
