const express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false); 
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
const connectDB = require('./backend/config/database'); // Ajuste aqui
const path = require('path');

// Middleware para servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Qualquer rota não capturada será redirecionada para o index.html do frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

dotenv.config({ path: './config.env' });

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
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,
    message: 'Muitas requisições feitas a partir deste IP, tente novamente em 15 minutos.'
});
app.use('/api', limiter);

// Rotas principais
app.use('/api/v1/usuarios', usuarioRoutes);
app.use('/api/v1/livros', livroRoutes);
app.use('/api/v1/emprestimos', emprestimoRoutes);

// Tratamento de erros global
app.use(globalErrorHandler);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.get('/', (req, res) => {
    res.send('Bem-vindo à API da Biblioteca Comunitária!');
  });  

// Conectar ao MongoDB
connectDB();

module.exports = app;
