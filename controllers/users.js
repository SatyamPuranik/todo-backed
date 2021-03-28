const User = require('../models/User');
const ErrorResponse = require('../utilis/errorResponse');

//@desc      Get all users
//@route     GET /api/v1/users
//@access    Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

//@desc      Get single user
//@route     GET /api/v1/users/:id
//@access    Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(`No user found with id ${req.params.id}`, 400)
      );
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(new ErrorResponse(`Wrong id : ${req.params.id}`, 400));
  }
};

//@desc      Add User
//@route     POST /api/v1/users
//@access    Private/Admin
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

//@desc      Update user
//@route     PUT /api/v1/users/:id
//@access    Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(`No user found with id ${req.params.id}`, 400)
      );
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(new ErrorResponse(`No user found with id ${req.params.id}`, 400));
  }
};

//@desc      Delete user
//@route     DELETE /api/v1/users/:id
//@access    Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(`No user found with id ${req.params.id}`, 400)
      );
    }

    user.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(new ErrorResponse(`No user found with id ${req.params.id}`, 400));
  }
};
