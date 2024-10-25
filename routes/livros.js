const express = require('express');
const router = express.Router();
const Livro = require('../models/Livro'); // Modelo do livro

// Rota para listar todos os livros
router.get('/', async (req, res) => {
    try {
        const livros = await Livro.find();
        res.json(livros);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar livros' });
    }
});

// Rota para adicionar um novo livro
router.post('/', async (req, res) => {
    const novoLivro = new Livro({
        titulo: req.body.titulo,
        autor: req.body.autor,
        genero: req.body.genero,
        dataDoacao: req.body.dataDoacao,
        codigoBarras: req.body.codigoBarras
    });

    try {
        const livroSalvo = await novoLivro.save();
        res.status(201).json(livroSalvo);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao adicionar livro' });
    }
});

// Rota para deletar um livro pelo ID
router.delete('/:id', async (req, res) => {
    try {
        await Livro.findByIdAndDelete(req.params.id);
        res.json({ message: 'Livro deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar o livro' });
    }
});

module.exports = router;
