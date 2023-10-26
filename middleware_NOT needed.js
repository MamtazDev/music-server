const authenticate = (req, res, next) => {
    if (req.authenticate()) {
      return next();
    }
  
    res.status(401).json({ message: 'Unauthorized' });
  };
  
  module.exports = {
    authenticate,
  };
  