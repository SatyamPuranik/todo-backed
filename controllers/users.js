//@desc      Get all users
//@route     GET /api/v1/users
//@access    Public
exports.getUsers = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'Show all Users'
  });
};

//@desc      Get single user
//@route     GET /api/v1/users/:id
//@access    Public
exports.getUser = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Show User ${req.params.id}`
  });
};

//@desc      Add User
//@route     POST /api/v1/users
//@access    Public
exports.createUser = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Add User`
  });
};

//@desc      Update user
//@route     PUT /api/v1/users/:id
//@access    Public
exports.updateUser = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Update User ${req.params.id}`
  });
};

//@desc      Delete user
//@route     DELETE /api/v1/users/:id
//@access    Public
exports.deleteUser = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Delete User ${req.params.id}`
  });
};
