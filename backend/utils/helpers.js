const crypto = require('crypto');

exports.formatDate = date => {
    return new Date(date).toLocaleDateString('pt-BR');
};

exports.calcularMulta = diasAtraso => {
    return diasAtraso * 0.5; // R$ 0,50 por dia de atraso
};

exports.slugify = text => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

exports.generateRandomString = length => {
    return crypto.randomBytes(length).toString('hex');
};

exports.isValidISBN = isbn => {
    // Implementar validação de ISBN
    return true;
};