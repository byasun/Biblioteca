const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Configuração do Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // limite de 100 requisições por IP
});

// Middlewares
app.use(helmet());
app.use(cors({
    origin: config.allowedOrigins,
    credentials: true
}));
app.use(morgan('combined', { stream: logger.stream }));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Conexão com o banco de dados
connectDB();

// Rotas
app.use('/api', require('./routes'));

// Middleware de erro
app.use(errorHandler);

// Inicialização do servidor
app.listen(config.port, () => {
    logger.info(`Servidor rodando na porta ${config.port} em modo ${config.env}`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
    logger.error('Erro não tratado:', err);
    process.exit(1);
});