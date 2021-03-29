const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  title: { type: String, trim: true, required: [true, 'Please add a title'] },
  description: { type: String, default: '' },
  importance: { type: Boolean, default: false },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Todo', TodoSchema);
