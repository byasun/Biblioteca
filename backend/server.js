const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const connectDB = require('./config/database');

const startServer = async () => {
    try {
        await connectDB();
        
        const server = app.listen(config.port, () => {
            logger.info(`Servidor rodando na porta ${config.port}`);
        });

        process.on('SIGTERM', () => {
            logger.info('SIGTERM recebido. Fechando servidor HTTP.');
            server.close(() => {
                logger.info('Servidor HTTP fechado.');
                process.exit(0);
            });
        });
    } catch (error) {
        logger.error('Erro ao iniciar servidor:', error);
        process.exit(1);
    }
};

startServer();