// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./db'); // Certifique-se que o caminho para sua conexão MongoDB está correto
const path = require('path');

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));  // Serve arquivos estáticos como CSS, imagens, etc.
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
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


// Rotas para servir outras páginas HTML
app.get('/views/cadastrarUsuario.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cadastrarUsuario.html'));
});

app.get('/views/cadastrarLivro.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cadastrarLivro.html'));
});

app.get('/views/pegarLivro.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'pegarLivro.html'));
});

app.get('/views/devolverLivro.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'devolverLivro.html'));
});

// Inicializando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
