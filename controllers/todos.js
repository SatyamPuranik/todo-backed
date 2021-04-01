const Todo = require('../models/Todo');
const User = require('../models/User');
const ErrorResponse = require('../utilis/errorResponse');

//@desc      Get all todos of a logged in user
//@route     GET /api/v1/todos
//@access    Private
exports.getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    next(error);
  }
};

//@desc      Get a single todo
//@route     GET /api/v1/todos/:id
//@access    Private
exports.getTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return next(
        new ErrorResponse(`No todo found with id ${req.params.id}`, 400)
      );
    }
    res.status(200).json({
      success: true,
      todo
    });
  } catch (error) {
    next(new ErrorResponse(`No todo found with id ${req.params.id}`, 400));
  }
};

//@desc      Add todo
//@route     POST /api/v1/todos
//@access    Private
exports.addTodo = async (req, res, next) => {
  try {
    const todo = await Todo.create({
      title: req.body.title,
      description: req.body.description,
      importance: req.body.importance,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

//@desc      Update a todo
//@route     PUT /api/v1/todos/:id
//@access    Private
exports.updateTodo = async (req, res, next) => {
  try {
    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      return next(
        new ErrorResponse(`No todo found with id ${req.params.id}`, 400)
      );
    }

    const fieldsToUpdate = {
      title: req.body.title || todo.title,
      description: req.body.description || todo.description,
      importance: req.body.importance || todo.importance
    };

    todo = await Todo.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      todo
    });
  } catch (error) {
    next(new ErrorResponse(`No todo found with id ${req.params.id}`, 400));
  }
};

//@desc      Delete a todo
//@route     Delete /api/v1/todos/:id
//@access    Private
exports.deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return next(
        new ErrorResponse(`No todo found with id ${req.params.id}`, 400)
      );
    }

    todo.remove();

    res.status(200).json({
      success: true,
      msg: 'Todo Deleted'
    });
  } catch (error) {
    next(new ErrorResponse(`No todo found with id ${req.params.id}`, 400));
  }
};
