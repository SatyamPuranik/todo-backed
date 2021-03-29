const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');

const {
  getTodos,
  getTodo,
  addTodo,
  updateTodo,
  deleteTodo
} = require('../controllers/todos');

router.route('/').get(protect, getTodos).post(protect, addTodo);
router
  .route('/:id')
  .get(protect, getTodo)
  .put(protect, updateTodo)
  .delete(protect, deleteTodo);

module.exports = router;
