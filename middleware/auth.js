const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utilis/errorResponse');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith('Bearer')
  // ) {
  //   // Set token from Bearer Token in header
  //   token = req.headers.authorization.split(' ')[1];
  // }
  // Set token from cookie
  //  else
  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

exports.authorize = async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+role');

  if (user.role === 'admin') {
    next();
  } else {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};
