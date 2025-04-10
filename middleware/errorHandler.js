// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error("🔴 Centralized error:", err.stack || err.message);
  
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  };
  
  module.exports = errorHandler;
  