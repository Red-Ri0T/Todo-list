// Routes for Todo API

const express = require('express');
const router = express.Router();
const todosController = require('../controllers/todos');

// GET /api/todos - Get all todos
router.get('/', todosController.getAllTodos);

// GET /api/todos/:id - Get a specific todo
router.get('/:id', todosController.getTodoById);

// POST /api/todos - Create a new todo
router.post('/', todosController.createTodo);

// PUT /api/todos/:id - Update a todo
router.put('/:id', todosController.updateTodo);

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', todosController.deleteTodo);

module.exports = router;