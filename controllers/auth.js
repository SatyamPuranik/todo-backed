const { findById } = require('../models/User');
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

//@desc      Forgot Password
//@route     PUT /api/v1/auth/forgotpassword
//@access    Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email, answer, newPassword } = req.body;

    const user = await User.findOne({ email }).select(
      '+password resetPasswordAnswer'
    );

    const isMatch = await user.matchAnswer(answer);

    if (!isMatch) {
      return next(new ErrorResponse('Wrong Answer', 401));
    }

    user.password = newPassword;

    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

//@desc      Update user details
//@route     PUT /api/v1/auth/updatedetails
//@access    Private
exports.updateDetails = async (req, res, next) => {
  let user = await User.findById(req.user.id).select('+resetPasswordAnswer');

  const fieldsToUpdate = {
    name: req.body.name || user.name,
    email: req.body.email || user.email,
    resetPasswordQuestion:
      req.body.resetPasswordQuestion || user.resetPasswordQuestion,
    resetPasswordAnswer:
      req.body.resetPasswordAnswer || user.resetPasswordAnswer
  };

  user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    msg: 'Details updated successfully'
  });
};

//@desc      Update password
//@route     PUT /api/v1/auth/updatepassword
//@access    Private
exports.updatePassword = async (req, res, next) => {
  let user = await User.findById(req.user.id).select('+password');

  const isMatch = await user.matchPassword(req.body.password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid Password', 401));
  }

  user.password = req.body.newPassword;

  await user.save();

  res.status(200).json({
    success: true,
    msg: 'Password updated successfully'
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
