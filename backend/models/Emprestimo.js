const mongoose = require('mongoose');

const emprestimoSchema = new mongoose.Schema({
    usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    },
    livro: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Livro', 
        required: true 
    },
    dataEmprestimo: { 
        type: Date, 
        default: Date.now 
    },
    dataDevolucao: Date,
    status: {
        type: String,
        enum: ['ATIVO', 'DEVOLVIDO'],
        default: 'ATIVO'
    }
}, { timestamps: true });

// Índices para melhorar a performance de consultas
emprestimoSchema.index({ usuario: 1, status: 1 });
emprestimoSchema.index({ livro: 1, status: 1 });

// Métodos do documento
emprestimoSchema.methods.devolver = function() {
    this.dataDevolucao = new Date();
    this.status = 'DEVOLVIDO';
    return this.save();
};

// Métodos estáticos
emprestimoSchema.statics = {
    findAtivos: async function() {
        return this.find({ status: 'ATIVO' })
            .populate('usuario', 'nome')
            .populate('livro', 'titulo');
    },

    findByUsuario: async function(usuarioId) {
        return this.find({ usuario: usuarioId })
            .populate('livro', 'titulo')
            .sort('-dataEmprestimo');
    },

    findByLivro: async function(livroId) {
        return this.find({ livro: livroId })
            .populate('usuario', 'nome')
            .sort('-dataEmprestimo');
    }
};

module.exports = mongoose.model('Emprestimo', emprestimoSchema);
