// Error handling middleware

const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(status).json({
      error: true,
      message: message
    });
  };
  
  module.exports = errorMiddleware;