const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      console.log('JWT payload:', jwt_payload);
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            console.log('User found for JWT payload:', jwt_payload.id);
            return done(null, user);
          }
          console.log('User not found for JWT payload:', jwt_payload.id);
          return done(null, false);
        })
        .catch((err) => {
          console.error('Error in JWT strategy:', err);
          done(err);
        });
    })
  );
};
