const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret'; // Added a default secret for local testing

const authenticate = (options = {}) => {
  return async (req, res, next) => {
    console.log("Entering authenticate middleware"); // Changed from console.debug for visibility

    // Debugging: Log all request headers
    console.log(`Request Headers: ${JSON.stringify(req.headers)}`); // Changed from console.debug for visibility

    // Extract token from Authorization header
    const authHeader = req.header('Authorization');

    // Debugging: Log the Authorization header
    console.log(`Authorization Header: ${authHeader}`); // Changed from console.debug for visibility

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('Missing or malformed Authorization header.');
      console.log("Exiting authenticate middleware with status 401"); // Changed from console.debug for visibility
      return res.status(401).json({ message: 'Missing or malformed Authorization header', action: 'clearToken' });
    }
    const token = authHeader.split(' ')[1];

    // Debugging: Log the extracted token
    console.log(`Extracted Token: ${token}`); // Changed from console.debug for visibility

    // Verify and decode the token
    try {
      console.log("Verifying token..."); // Changed from console.debug for visibility
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("Decoded JWT:", decoded);

      // Debugging: Log the decoded token and ID
      console.log(`Decoded Token: ${JSON.stringify(decoded)}`); // Changed from console.debug for visibility
      console.log(`Decoded Token ID: ${decoded.id}`); // Changed from console.debug for visibility

      // Fetch the corresponding user
      console.log("Fetching user..."); // Changed from console.debug for visibility
      const user = await User.findById(decoded.id).select('-password');

      // Debugging: Log the fetched user
      console.log(`Fetched User: ${JSON.stringify(user)}`); // Changed from console.debug for visibility

      if (!user) {
        console.warn('No user found for the provided token.');
        console.log("Exiting authenticate middleware with status 401"); // Changed from console.debug for visibility
        return res.status(401).json({ message: 'The user belonging to this token does no longer exist', action: 'clearToken' });
      }

      // Attach user to the request object
      req.user = user;
      console.log('User set by JWT:', user); // Changed from console.debug for visibility
      console.log("Exiting authenticate middleware successfully"); // Changed from console.debug for visibility
      next();
    } catch (error) {
      console.error('Error in authentication middleware:', error);
      console.log("Exiting authenticate middleware with error"); // Changed from console.debug for visibility
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Token expired', action: 'clearToken' });
      } else {
        return res.status(401).json({ message: 'Invalid token. Please log in again', action: 'clearToken' });
      }
    }
  };
};

module.exports = authenticate;
