const jwt = require('jsonwebtoken');
const passport = require('passport');

const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error', error: err.message }); // Added error message for debugging
    }
    if (!user) {
      console.error(info);
      return res.status(401).json({ message: 'Unauthorized', reason: info.message }); // Added reason for debugging
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = {
  authenticate,
};
