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
        sparse: true,
        validate: {
            validator: v => !v || /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(v),
            message: 'ISBN/Código de barras inválido'
        }
    },
    doador: {
        nome: {
            type: String,
            required: [true, 'Por favor, informe o nome do doador'],
            trim: true
        },
        dataDoacao: { type: Date, default: Date.now }
    },
    localizacao: {
        estante: {
            type: String,
            required: [true, 'Por favor, informe a estante'],
            trim: true
        },
        observacao: String
    },
    status: {
        type: String,
        enum: ['DISPONIVEL', 'EMPRESTADO'],
        default: 'DISPONIVEL'
    }
}, { timestamps: true });

// Índices para melhorar a performance de buscas
livroSchema.index({ titulo: 'text', autor: 'text' });
livroSchema.index({ 'doador.nome': 1 });
livroSchema.index({ isbn: 1 });

// Método para verificar disponibilidade
livroSchema.methods.estaDisponivel = function() {
    return this.status === 'DISPONIVEL';
};

// Métodos estáticos para busca
livroSchema.statics.findDisponiveis = function() {
    return this.find({ status: 'DISPONIVEL' });
};

livroSchema.statics.findByEstante = function(estante) {
    return this.find({ 'localizacao.estante': estante });
};

livroSchema.statics.findByDoador = function(nomeDoador) {
    return this.find({ 'doador.nome': new RegExp(nomeDoador, 'i') });
};

module.exports = mongoose.model('Livro', livroSchema);
