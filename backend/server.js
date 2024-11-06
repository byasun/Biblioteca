const app = require('./app');
const logger = require('./middleware/logger');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM recebido. Fechando servidor HTTP.');
    server.close(() => {
        console.log('Servidor HTTP fechado.');
        process.exit(0);
    });
});
