// Authentication middleware - API Key verification

const authMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    // Get the API key from environment variable
    const validApiKey = process.env.API_KEY;
    
    if (!apiKey) {
      return res.status(401).json({ 
        error: 'Authentication failed', 
        message: 'API key is required' 
      });
    }
    
    if (apiKey !== validApiKey) {
      return res.status(403).json({ 
        error: 'Authentication failed', 
        message: 'Invalid API key' 
      });
    }
    
    next();
  };
  
  module.exports = authMiddleware;