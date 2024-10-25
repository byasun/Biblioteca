const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    genero: { type: String, required: true },
    anoPublicacao: { type: Number, required: true },
});

module.exports = mongoose.model('Livro', livroSchema);
