// Controller for Todo operations

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const todosFilePath = path.join(__dirname, '..', 'data', 'todos.json');

// Helper function to read todos from file
const readTodos = () => {
  try {
    const data = fs.readFileSync(todosFilePath);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write todos to file
const writeTodos = (todos) => {
  fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
};

// Get all todos
exports.getAllTodos = (req, res) => {
  const todos = readTodos();
  res.json(todos);
};

// Get a single todo by ID
exports.getTodoById = (req, res) => {
  const todos = readTodos();
  const todo = todos.find(t => t.id === req.params.id);
  
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  
  res.json(todo);
};

// Create a new todo
exports.createTodo = (req, res) => {
  const { title, description } = req.body;
  
  // Validate request body
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  
  const newTodo = {
    id: uuidv4(),
    title,
    description: description || '',
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  const todos = readTodos();
  todos.push(newTodo);
  writeTodos(todos);
  
  res.status(201).json(newTodo);
};

// Update a todo
exports.updateTodo = (req, res) => {
  const { title, description, completed } = req.body;
  const todoId = req.params.id;
  
  const todos = readTodos();
  const todoIndex = todos.findIndex(t => t.id === todoId);
  
  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  
  // Update the todo with new values if provided
  todos[todoIndex] = {
    ...todos[todoIndex],
    title: title !== undefined ? title : todos[todoIndex].title,
    description: description !== undefined ? description : todos[todoIndex].description,
    completed: completed !== undefined ? completed : todos[todoIndex].completed,
    updatedAt: new Date().toISOString()
  };
  
  writeTodos(todos);
  
  res.json(todos[todoIndex]);
};

// Delete a todo
exports.deleteTodo = (req, res) => {
  const todoId = req.params.id;
  
  const todos = readTodos();
  const filteredTodos = todos.filter(t => t.id !== todoId);
  
  if (filteredTodos.length === todos.length) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  
  writeTodos(filteredTodos);
  
  res.json({ message: 'Todo deleted successfully' });
};