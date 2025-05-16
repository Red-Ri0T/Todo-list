// This is the main entry point for our Todo API

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const todoRoutes = require('./routes/todos');
const authMiddleware = require('./middleware/auth');
const errorMiddleware = require('./middleware/error');
const fs = require('fs');
const path = require('path');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Create todos.json if it doesn't exist
const todosFile = path.join(dataDir, 'todos.json');
if (!fs.existsSync(todosFile)) {
  fs.writeFileSync(todosFile, JSON.stringify([], null, 2));
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, 'HTML')));

// Routes
app.use('/api/todos', authMiddleware, todoRoutes);

// Home route
app.get('/', (req, res) => {
  // Check if request wants HTML
  const acceptHeader = req.headers.accept || '';
  if (acceptHeader.includes('text/html')) {
    // Serve the frontend HTML
    res.sendFile(path.join(__dirname, 'HTML', 'site.html'));
  } else {
    // Serve API info as JSON
    res.json({
      message: 'Welcome to the Todo API!',
      documentation: 'See README for API documentation',
      endpoints: [
        { method: 'GET', path: '/api/todos', description: 'Get all todos' },
        { method: 'GET', path: '/api/todos/:id', description: 'Get a specific todo' },
        { method: 'POST', path: '/api/todos', description: 'Create a new todo' },
        { method: 'PUT', path: '/api/todos/:id', description: 'Update a todo' },
        { method: 'DELETE', path: '/api/todos/:id', description: 'Delete a todo' }
      ],
      authentication: 'API key required in header: X-API-Key'
    });
  }
});

// Error handling middleware
app.use(errorMiddleware);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/todos`);
});