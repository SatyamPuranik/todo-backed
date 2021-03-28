const ErrorResponse = require('../utilis/errorResponse');

const errorHandler = (error, req, res, next) => {
  let err = { ...error };
  err.message = error.message;

  // Log to console for dev
  console.log(error.stack.red);

  if (error.name === 'CastError') {
    const message = `Resource not found`;
    err = new ErrorResponse(message, 404);
  }

  if (err.code == 11000) {
    const message = 'Duplicate field value entered';
    err = new ErrorResponse(message, 400);
  }

  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors).map((val) => val.message);
    console.log(error);
    err = new ErrorResponse(message, 400);
  }

  if (error.name === 'TypeError') {
    const message = 'Invaild Email';
    console.log(error);
    err = new ErrorResponse(message, 400);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
};

module.exports = errorHandler;
