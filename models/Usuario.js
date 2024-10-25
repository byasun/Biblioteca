// models/usuario.js

const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    matricula: {
        type: String,
        required: true,
        unique: true
    },
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telefone: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
