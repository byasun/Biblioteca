const app = require('./app');
const logger = require('./backend/utils/logger');

// Porta do servidor
const PORT = process.env.PORT || 3000;

// Iniciar o servidor
const server = app.listen(PORT, () => {
    logger.info(`Servidor rodando na porta ${PORT}`);
});

// Encerramento gracioso do servidor
process.on('SIGTERM', () => {
    logger.info('SIGTERM recebido. Fechando servidor HTTP.');
    server.close(() => {
        logger.info('Servidor HTTP fechado.');
        process.exit(0);
    });
});
