const mongoose = require('mongoose');

const emprestimoSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    livroId: { type: mongoose.Schema.Types.ObjectId, ref: 'Livro', required: true },
    dataEmprestimo: { type: Date, default: Date.now },
    dataDevolucao: { type: Date, required: true },
}, { timestamps: true }); // Adiciona createdAt e updatedAt

module.exports = mongoose.model('Emprestimo', emprestimoSchema);
