module.exports = (app, passport) => {
  app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
      res.render('index', {user: req.user});
    } else {
      res.render('index');
    }
  });

  app.get('/login', (req, res) => {
    res.render('login', {message: req.flash('loginMessage')});
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/signup', (req, res) => {
    res.render('signup', {message: req.flash('signupMessage')});
    // res.render('signup');
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
  });
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}