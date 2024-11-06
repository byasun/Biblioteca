const express = require('express');
const dotenv = require('dotenv');
const usuarioRoutes = require('./routes/usuarioRoutes');
const livroRoutes = require('./routes/livroRoutes');
const emprestimoRoutes = require('./routes/emprestimoRoutes');
const globalErrorHandler = require('./middleware/errorHandler');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const path = require('path');

dotenv.config();
const app = express();

// Middleware de segurança
app.use(helmet());
app.use(cors());
app.use(compression());

// Middleware de parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Limitação de requisições
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: 'Muitas requisições deste IP, tente novamente em 15 minutos.'
});
app.use('/api', limiter);

// Conectar ao MongoDB
connectDB();

// Rotas principais
app.use('/api/v1/usuarios', usuarioRoutes);
app.use('/api/v1/livros', livroRoutes);
app.use('/api/v1/emprestimos', emprestimoRoutes);

// Middleware para servir arquivos estáticos (frontend)
app.use(express.static(path.join(__dirname, 'public'))); // Ajuste para caminho correto

// Para todas as rotas não capturadas, envia o index.html (single-page app)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Tratamento de erros global
app.use(globalErrorHandler);

module.exports = app;
