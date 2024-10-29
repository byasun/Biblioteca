const AppError = require('./appError');

module.exports = fn => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next))
    .catch(err => {
      if (!(err instanceof AppError)) {
        console.error('Erro não tratado:', err);
        err = new AppError('Erro interno do servidor', 500);
      }
      next(err);
    });
  };
};