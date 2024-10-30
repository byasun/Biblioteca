const { body, validationResult, param } = require('express-validator');

// Regex patterns para validações
const PATTERNS = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    telefone: /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/,
    nome: /^[a-zA-ZÀ-ÿ\s]{2,}$/,
    matricula: /^[0-9]{4,10}$/,
    isbn: /^(97(8|9))?\d{9}(\d|X)$/, // Padrão para ISBN
};

// Mensagens de erro personalizadas
const MENSAGENS_ERRO = {
    required: campo => `O campo ${campo} é obrigatório!`,
    invalid: campo => `O campo ${campo} está em formato inválido!`,
    minLength: (campo, min) => `O campo ${campo} deve ter no mínimo ${min} caracteres!`,
    maxLength: (campo, max) => `O campo ${campo} deve ter no máximo ${max} caracteres!`,
    anoInvalido: 'O ano de publicação deve estar entre 1800 e o ano atual!',
    emailInvalido: 'Por favor, insira um email válido!',
    telefoneInvalido: 'Por favor, insira um telefone válido no formato (XX) XXXXX-XXXX!',
    nomeInvalido: 'O nome deve conter apenas letras e espaços!',
    matriculaInvalida: 'A matrícula deve conter apenas números e ter entre 4 e 10 dígitos!',
    isbnInvalido: 'O ISBN deve estar em um formato válido!',
};

// Middleware de validação para registro de usuário
const registroUsuario = [
    body('nome').trim().notEmpty().withMessage(MENSAGENS_ERRO.required('nome')),
    body('email').trim().isEmail().withMessage(MENSAGENS_ERRO.emailInvalido),
    body('senha').trim().isLength({ min: 6 }).withMessage(MENSAGENS_ERRO.minLength('senha', 6)),
    body('matricula').trim().matches(PATTERNS.matricula).withMessage(MENSAGENS_ERRO.matriculaInvalida),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Middleware de validação para login de usuário
const login = [
    body('email').trim().isEmail().withMessage(MENSAGENS_ERRO.emailInvalido),
    body('senha').trim().isLength({ min: 6 }).withMessage(MENSAGENS_ERRO.minLength('senha', 6)),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Middleware de validação para livro
const validateLivro = [
    body('titulo').trim().notEmpty().withMessage(MENSAGENS_ERRO.required('título')),
    body('autor').trim().notEmpty().withMessage(MENSAGENS_ERRO.required('autor')),
    body('isbn').optional().matches(PATTERNS.isbn).withMessage(MENSAGENS_ERRO.isbnInvalido),
    // Adicione mais campos conforme necessário
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    registroUsuario,
    login,
    validateLivro, // Exportando a validação de livro
    queryParams: (validParams) => {
        return (req, res, next) => {
            const params = Object.keys(req.query);
            const invalidParams = params.filter(param => !validParams.includes(param));

            if (invalidParams.length > 0) {
                return res.status(400).json({
                    status: 'fail',
                    message: `Parâmetros inválidos: ${invalidParams.join(', ')}`
                });
            }

            next();
        };
    },
    params: (param) => {
        return (req, res, next) => {
            if (!req.params[param]) {
                return res.status(400).json({
                    status: 'fail',
                    message: `Parâmetro ${param} é obrigatório!`
                });
            }
            next();
        };
    },
};
