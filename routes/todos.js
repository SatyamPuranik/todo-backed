const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');

const { getTodos, addTodo } = require('../controllers/todos');

router.route('/').get(protect, getTodos).post(protect, addTodo);

module.exports = router;
