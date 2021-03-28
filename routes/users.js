const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

router
  .route('/')
  .get(protect, authorize, getUsers)
  .post(protect, authorize, createUser);

router
  .route('/:id')
  .get(protect, authorize, getUser)
  .put(protect, authorize, updateUser)
  .delete(protect, authorize, deleteUser);

module.exports = router;
