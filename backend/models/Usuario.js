const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const usuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Por favor, informe o nome'],
        trim: true,
        minlength: [3, 'Nome deve ter no mínimo 3 caracteres']
    },
    email: {
        type: String,
        required: [true, 'Por favor, informe o email'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Por favor, informe um email válido']
    },
    telefone: {
        type: String,
        required: [true, 'Por favor, informe o telefone'],
        validate: {
            validator: v => /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/.test(v),
            message: 'Formato de telefone inválido'
        }
    },
    senha: {
        type: String,
        required: [true, 'Por favor, informe a senha'],
        minlength: [6, 'Senha deve ter no mínimo 6 caracteres'],
        select: false // Não retorna a senha nas consultas
    },
    matricula: {
        type: String,
        sparse: true,
        unique: true,
        trim: true
    },
    chaveRede: {
        type: String,
        sparse: true,
        unique: true,
        trim: true
    },
    ativo: {
        type: Boolean,
        default: true
    },
    ultimoAcesso: {
        type: Date
    }
}, { timestamps: true });

// Middleware para hash da senha antes de salvar
usuarioSchema.pre('save', async function(next) {
    if (!this.isModified('senha')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.senha = await bcrypt.hash(this.senha, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Métodos do modelo
usuarioSchema.methods.compararSenha = function(senhaInformada) {
    return bcrypt.compare(senhaInformada, this.senha);
};

usuarioSchema.methods.podeEmprestar = function() {
    return this.emprestimosAtivos.length < 3 && this.ativo;
};

// Métodos estáticos
usuarioSchema.statics.findByEmail = function(email) {
    return this.findOne({ email });
};

usuarioSchema.statics.findAtivos = function() {
    return this.find({ ativo: true });
};

module.exports = mongoose.model('Usuario', usuarioSchema);
