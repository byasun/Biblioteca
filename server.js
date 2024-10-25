// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./db'); // Certifique-se de que o caminho para sua conexão MongoDB está correto
const path = require('path');

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));  // Serve arquivos estáticos da pasta 'public'

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
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rotas para servir outras páginas HTML
app.get('/cadastrarUsuario', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cadastrarUsuario.html'));
});

app.get('/cadastrarLivro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cadastrarLivro.html'));
});

app.get('/pegarLivro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pegarLivro.html'));
});

app.get('/devolverLivro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'devolverLivro.html'));
});

// Inicializando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
