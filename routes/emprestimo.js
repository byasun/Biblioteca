const express = require('express');
const router = express.Router();
const Emprestimo = require('../models/Emprestimo'); // Modelo do empréstimo

// Rota para listar todos os empréstimos
router.get('/', async (req, res) => {
    try {
        const emprestimos = await Emprestimo.find();
        res.json(emprestimos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar empréstimos' });
    }
});

// Rota para registrar um novo empréstimo
router.post('/', async (req, res) => {
    const novoEmprestimo = new Emprestimo({
        idUsuario: req.body.idUsuario,
        codigoBarras: req.body.codigoBarras,
        dataEmprestimo: req.body.dataEmprestimo,
        dataDevolucao: req.body.dataDevolucao
    });

    try {
        const emprestimoSalvo = await novoEmprestimo.save();
        res.status(201).json(emprestimoSalvo);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao registrar empréstimo' });
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
        res.status(500).json({ message: 'Erro ao atualizar data de devolução' });
    }
});

module.exports = router;
