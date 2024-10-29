const AppError = require('../utils/appError');

const AppError = require('../utils/appError');
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
    logger.error(err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }

    return res.status(500).json({
        status: 'error',
        message: 'Erro interno do servidor'
    });
};

exports.errorHandler = (err, req, res, next) => {
    // Log detalhado do erro
    console.error('Error: ', err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack // Opcional, para desenvolvimento
        });
    }

    // Tratamento de erros não esperados
    return res.status(500).json({
        status: 'error',
        message: 'Erro interno do servidor'
    });
};

exports.notFound = (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Recurso não encontrado'
    });
};