module.exports = {
    sendSuccess: (res, message, data = null) => {
      res.status(200).json({ status: 'success', message, data });
    },
    sendError: (res, message, statusCode = 500) => {
      res.status(statusCode).json({ status: 'error', message });
    }
  };
  