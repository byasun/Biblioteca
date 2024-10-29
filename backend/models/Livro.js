const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'Por favor, informe o título'],
        trim: true,
        index: true
    },
    autor: {
        type: String,
        required: [true, 'Por favor, informe o autor'],
        trim: true,
        index: true
    },
    isbn: {
        type: String,
        trim: true,
        sparse: true, // Permite que alguns documentos não tenham ISBN
        validate: {
            validator: function(v) {
                // Se não houver ISBN, retorna true (válido)
                if (!v) return true;
                // Se houver, valida o formato
                return /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(v);
            },
            message: 'ISBN/Código de barras inválido'
        }
    },
    doador: {
        nome: {
            type: String,
            required: [true, 'Por favor, informe o nome do doador'],
            trim: true
        },
        dataDoacao: {
            type: Date,
            default: Date.now
        }
    },
    localizacao: {
        estante: {
            type: String,
            required: [true, 'Por favor, informe a estante'],
            trim: true
        },
        observacao: String
    },
    emprestimos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Emprestimo'
    }],
    status: {
        type: String,
        enum: ['DISPONIVEL', 'EMPRESTADO'],
        default: 'DISPONIVEL'
    }
}, {
    timestamps: true
});

// Índices para melhorar a performance de buscas
livroSchema.index({ titulo: 'text', autor: 'text' });
livroSchema.index({ 'doador.nome': 1 });
livroSchema.index({ isbn: 1 });

// Métodos do modelo
livroSchema.methods = {
    // Verifica se livro está disponível para empréstimo
    estaDisponivel() {
        return this.status === 'DISPONIVEL';
    }
};

// Métodos estáticos
livroSchema.statics = {
    // Busca livros disponíveis
    findDisponiveis() {
        return this.find({ status: 'DISPONIVEL' });
    },

    // Busca por estante
    findByEstante(estante) {
        return this.find({ 'localizacao.estante': estante });
    },

    // Busca por doador
    findByDoador(nomeDoador) {
        return this.find({ 'doador.nome': new RegExp(nomeDoador, 'i') });
    }
};

module.exports = mongoose.model('Livro', livroSchema);