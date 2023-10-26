const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET;

console.log("[Debug] Loading isAuthenticated middleware...");

module.exports = async (req, res, next) => {
  console.log("Headers received:", req.headers);

  // Log the Authorization header specifically
  console.log("Authorization Header:", req.headers.authorization);
  
  const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');
  
  // Log the JWT_SECRET for debugging
  console.log("JWT_SECRET is set to:", JWT_SECRET);

  if (!token) {
    console.warn('No token provided.');
    return res.status(401).json({ 
      message: 'No token, authorization denied',
      action: 'clearToken'
    });
  }

  console.log('Received token:', token);

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decoded successfully:', decoded);
    
    // Fetch user from database
    const user = await User.findById(decoded.id);

    if (!user) {
      console.warn('No user found for the provided token.');
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token does no longer exist',
        action: 'clearToken'
      });
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in authenticate middleware:', error);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired',
        action: 'clearToken'
      });
    } else {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. Please log in again',
        action: 'clearToken'
      });
    }
  }
};
