const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');

const {} = require('../controllers/todos');

router.route('/').get(protect).post(protect);

router.route('/:id').get(protect).put(protect).delete(protect);

module.exports = router;
