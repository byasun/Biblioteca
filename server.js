const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./db'); // Certifique-se de que o caminho para sua conexão MongoDB está correto
const path = require('path');
const helmet = require('helmet'); // Para segurança
const cors = require('cors'); // Para permitir CORS

const app = express();

// Middlewares
app.use(helmet()); // Protege seu aplicativo
app.use(cors()); // Permite CORS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend', 'public'))); // Esta linha permanece a mesma

// Definindo o motor de visualização como EJS
app.set('view engine', 'ejs');

// Importação das rotas
const livroRoutes = require('./routes/livros');
const usuarioRoutes = require('./routes/usuario');
const emprestimoRoutes = require('./routes/emprestimo');

// Uso das rotas
app.use('/api/livros', livroRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/emprestimos', emprestimoRoutes);

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Rotas para servir outras páginas HTML
app.get('/cadastrarUsuario', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'cadastrarUsuario.html'));
});

app.get('/cadastrarLivro', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'cadastrarLivro.html'));
});

app.get('/pegarLivro', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'pegarLivro.html'));
});

app.get('/devolverLivro', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'devolverLivro.html'));
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo deu errado!', error: err.message });
});

// Inicializando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
