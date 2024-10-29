const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Importação das rotas
const authRoutes = require('./auth');
const livrosRoutes = require('./livrosRoutes');
const emprestimoRoutes = require('./emprestimoRoutes');
const usuarioRoutes = require('./usuarioRoutes');

// Middleware de logging
const logger = require('../utils/logger');

const router = express.Router();

router.use('/usuarios', usuarioRoutes);
router.use('/livros', livroRoutes);
router.use('/emprestimos', emprestimoRoutes);
router.use('/auth', authRoutes);

// Configuração do Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Biblioteca',
            version: '1.0.0',
            description: 'API para sistema de gerenciamento de biblioteca',
            contact: {
                name: 'Suporte',
                email: 'suporte@biblioteca.com'
            }
        },
        servers: [
            {
                url: process.env.BASE_URL || 'http://localhost:3000',
                description: 'Servidor Principal'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./routes/*.js'] // Arquivos que contêm anotações do Swagger
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware para logging de requisições
router.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next();
});

// Verificação de saúde da API
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API está funcionando normalmente',
        timestamp: new Date().toISOString()
    });
});

// Rotas principais
router.use('/auth', authRoutes);
router.use('/livros', livrosRoutes);
router.use('/emprestimos', emprestimoRoutes);
router.use('/usuarios', usuarioRoutes);

// Rota para documentação da API
router.get('/docs', (req, res) => {
    res.redirect('/api-docs');
});

// Tratamento de rotas não encontradas
router.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Rota ${req.originalUrl} não encontrada`
    });
});

// Tratamento de erros
router.use((err, req, res, next) => {
    logger.error('Erro:', err);
    
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Erro interno do servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

module.exports = router;