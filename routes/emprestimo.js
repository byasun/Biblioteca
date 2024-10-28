const express = require('express');
const router = express.Router();
const Emprestimo = require('../models/Emprestimo');

// Rota para listar todos os empréstimos
router.get('/', async (req, res) => {
    try {
        const emprestimos = await Emprestimo.find().populate('usuarioId livroId'); // Popula os dados dos usuários e livros
        res.json(emprestimos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar empréstimos', error: error.message });
    }
});

// Rota para registrar um novo empréstimo
router.post('/', async (req, res) => {
    const { usuarioId, livroId, dataEmprestimo, dataDevolucao } = req.body;

    const novoEmprestimo = new Emprestimo({
        usuarioId,
        livroId,
        dataEmprestimo,
        dataDevolucao,
    });

    try {
        const emprestimoSalvo = await novoEmprestimo.save();
        res.status(201).json(emprestimoSalvo);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Erro ao registrar empréstimo', error: error.message });
    }
});

// Rota para atualizar a data de devolução
router.patch('/:id', async (req, res) => {
    try {
        const emprestimoAtualizado = await Emprestimo.findByIdAndUpdate(
            req.params.id,
            { dataDevolucao: req.body.dataDevolucao },
            { new: true }
        );
        res.json(emprestimoAtualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar data de devolução', error: error.message });
    }
});

module.exports = router;
