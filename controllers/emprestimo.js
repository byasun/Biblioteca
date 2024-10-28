// controllers/emprestimo.js
const Emprestimo = require('../models/Emprestimo'); // Verifique o nome do arquivo e ajuste se necessário

exports.createEmprestimo = async (req, res) => {
    const { usuarioId, livroId, dataEmprestimo, dataDevolucao } = req.body;
    const novoEmprestimo = new Emprestimo({ usuarioId, livroId, dataEmprestimo, dataDevolucao });
    try {
        await novoEmprestimo.save();
        res.status(201).json(novoEmprestimo);
    } catch (error) {
        res.status(400).json({ message: `Erro ao criar empréstimo: ${error.message}` });
    }
};

exports.getEmprestimos = async (req, res) => {
    try {
        const emprestimos = await Emprestimo.find();
        res.status(200).json(emprestimos);
    } catch (error) {
        res.status(500).json({ message: `Erro ao listar empréstimos: ${error.message}` });
    }
};
