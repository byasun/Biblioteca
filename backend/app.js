const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const usuarioRoutes = require('./routes/usuarioRoutes');
const livroRoutes = require('./routes/livroRoutes');
const emprestimoRoutes = require('./routes/emprestimoRoutes');
const globalErrorHandler = require('./controllers/errorController');

dotenv.config({ path: './config.env' });

const app = express();

// Conexão ao MongoDB
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Conectado ao MongoDB!');
}).catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
});

// Middleware
app.use(express.json());
app.use(express.static('public')); // Para servir arquivos estáticos
app.use('/uploads', express.static('uploads')); // Para servir uploads de imagens

// Rotas
app.use('/api/v1/usuarios', usuarioRoutes);
app.use('/api/v1/livros', livroRoutes);
app.use('/api/v1/emprestimos', emprestimoRoutes);

// Tratamento de erros global
app.use(globalErrorHandler);

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});