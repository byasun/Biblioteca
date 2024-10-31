const AppError = require('../utils/appError');

exports.errorHandler = (err, req, res, next) => {
    // Erros conhecidos (AppError)
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }

    // Erros desconhecidos
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

const globalErrorHandler = (err, req, res, next) => {
    // Lógica para tratar o erro
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message || 'Erro interno do servidor'
    });
};

module.exports = globalErrorHandler;
