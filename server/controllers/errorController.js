const ErrorHandler = require('../utils/error');

const handleMongoDuplicateFieldError = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    //console.log(err);
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new ErrorHandler(400, message);
};

const handleMongoValidationError = err => {
    const errors = Object.values(err.errors)
        .map(el => el.message)
        .join('. ');
    const message = `Invalid input data. ${errors}`;
    return new ErrorHandler(400, message);
};

const handleMongooseCastError = err => {
    return new ErrorHandler(400, err.message);
};

exports.handleMongoError = err => {
    let appError;

    if (err.name === 'CastError') {
        appError = handleMongooseCastError(err);
    } else if (err.code === 11000) {
        appError = handleMongoDuplicateFieldError(err);
    } else {
        appError = handleMongoValidationError(err);
    }
    return appError;
};
