const mongoose = require('mongoose');
const validator = require('validator'); // Adicionando validator

const usuarioSchema = new mongoose.Schema({
    matricula: {
        type: String,
        required: true,
        unique: true,
    },
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, 'Email inválido'], // Validação de email
    },
    telefone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\d{2}\s\d{5}-\d{4}/.test(v); // Validação de telefone (ex: 12 34567-1234)
            },
            message: props => `${props.value} não é um número de telefone válido!`,
        },
    },
}, { timestamps: true }); // Adiciona createdAt e updatedAt

module.exports = mongoose.model('Usuario', usuarioSchema);
