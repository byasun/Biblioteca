class AppError extends Error {
  constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
      this.timestamp = new Date().toISOString();

      Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
      return {
          status: this.status,
          statusCode: this.statusCode,
          message: this.message,
          timestamp: this.timestamp,
          isOperational: this.isOperational,
          stack: process.env.NODE_ENV === 'development' ? this.stack : undefined
      };
  }
}

module.exports = AppError;