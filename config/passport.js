const LocalStrategy   = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const User = require('./../app/models/user');

const configAuth = require('./auth');

module.exports = function(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, username, password, done) => {
    process.nextTick(() => {
      User.findOne({'local.username': username}, (err, user) => {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, false, req.flash('signupMessage', 'Username already exist.'));
        } else {
          const newUser = new User();
          newUser.local.username = username;
          newUser.local.password = newUser.generateHash(password);
          newUser.save((err) => {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, username, password, done) => {
    process.nextTick(() => {
      User.findOne({'local.username': username}, (err, user) => {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false, req.flash('loginMessage', 'User not found.'));
        }
        if (!user.validPassword(password)) {
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password!'));
        }

        return done(null, user);
      })
    });
  }));

  passport.use(new TwitterStrategy({
    consumerKey: configAuth.twitterAuth.consumerKey,
    consumerSecret: configAuth.twitterAuth.consumerSecret,
    callbackURL: configAuth.twitterAuth.callbackURL
  }, function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({'twitter.id': profile.id}, (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, user);
        } else {
          const newUser = new User();
          newUser.twitter.id          = profile.id;
          newUser.twitter.token       = token;
          newUser.twitter.displayName = profile.displayName;
          newUser.twitter.username    = profile.username;
          newUser.save((err) => {
            if (err) {
              throw err;
            }

            return done(null, newUser);
          });
        }
      });
    });
  }));
};