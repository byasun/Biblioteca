const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const usuarioRoutes = require('./backend/routes/usuarioRoutes');
const livroRoutes = require('./backend/routes/livroRoutes');
const emprestimoRoutes = require('./backend/routes/emprestimoRoutes');
const globalErrorHandler = require('./backend/controllers/errorController');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const logger = require('./backend/utils/logger');

dotenv.config({ path: './config.env' });

const app = express();
const routes = require('./routes/index');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite de 100 requisições por IP
    message: 'Muitas requisições feitas a partir deste IP, tente novamente em 15 minutos.'
});
app.use('/api', limiter);

// Conexão ao MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info('MongoDB conectado com sucesso!');
    } catch (err) {
        logger.error('Erro ao conectar ao MongoDB:', err);
        process.exit(1);
    }
};

// Rotas
app.use('/api/v1', require('./backend/routes'));

// Tratamento de erros global
app.use(globalErrorHandler);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    logger.info(`Servidor rodando na porta ${PORT}`);
});

// Conectar ao banco de dados
connectDB();

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received. Closing HTTP server.');
    server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
    });
});

module.exports = app;