const User = require('../models/User');
const ErrorResponse = require('../utilis/errorResponse');

//@desc      Register user
//@route     POST /api/v1/auth/register
//@access    Public
exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      resetPasswordQuestion,
      resetPasswordAnswer,
      role
    } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      resetPasswordQuestion,
      resetPasswordAnswer,
      role
    });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

//@desc      Login user
//@route     POST /api/v1/auth/login
//@access    Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new ErrorResponse('Please provide an email and password', 400)
      );
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid Credentials', 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid Credentials', 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

//@desc      Get logged in user
//@route     POST /api/v1/auth/me
//@access    Private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secrue = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};
