const User = require('../models/User');
const ErrorResponse = require('../utilis/errorResponse');

//@desc      Register user
//@route     POST /api/v1/auth/register
//@access    Public
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password
  });

  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token
  });
};

//@desc      Login user
//@route     POST /api/v1/auth/register
//@access    Public
exports.login = async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password
  });

  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token
  });
};
