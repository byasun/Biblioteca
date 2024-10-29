exports.success = (res, data, statusCode = 200) => {
    res.status(statusCode).json({
        status: 'success',
        data
    });
};

exports.error = (res, message, statusCode = 400) => {
    res.status(statusCode).json({
        status: 'error',
        message
    });
};