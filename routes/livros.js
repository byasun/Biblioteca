const express = require('express');
const router = express.Router();
const Livro = require('../models/Livro');

// Rota para listar todos os livros
router.get('/', async (req, res) => {
    try {
        const livros = await Livro.find();
        res.json(livros);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar livros', error: error.message });
    }
});

// Rota para adicionar um novo livro
router.post('/', async (req, res) => {
    const { titulo, autor, genero, anoPublicacao } = req.body;

    const novoLivro = new Livro({
        titulo,
        autor,
        genero,
        anoPublicacao,
    });

    try {
        const livroSalvo = await novoLivro.save();
        res.status(201).json(livroSalvo);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Erro ao adicionar livro', error: error.message });
    }
});

// Rota para deletar um livro pelo ID
router.delete('/:id', async (req, res) => {
    try {
        const livroDeletado = await Livro.findByIdAndDelete(req.params.id);
        if (!livroDeletado) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }
        res.json({ message: 'Livro deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar o livro', error: error.message });
    }
});

module.exports = router;
