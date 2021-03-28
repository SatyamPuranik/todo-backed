const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please add a name'] },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  resetPasswordQuestion: {
    type: String,
    required: [
      true,
      'Please add a question. This question will be asked if you forget your password.'
    ]
  },
  resetPasswordAnswer: {
    type: String,
    required: [true, 'Please add answer to your security question.'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('resetPasswordAnswer')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.resetPasswordAnswer = await bcrypt.hash(this.resetPasswordAnswer, salt);
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.matchAnswer = async function (enteredAnswer) {
  return await bcrypt.compare(enteredAnswer, this.resetPasswordAnswer);
};

module.exports = mongoose.model('User', UserSchema);
