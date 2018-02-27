const Poll = require('./models/poll');

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

  app.get('/newpoll', (req, res) => {
    if (req.isAuthenticated()) {
      res.render('newpoll', {user: req.user});
    } else {
      res.redirect('/');
    }
  });

  app.post('/newpoll', (req, res) => {
    const newPoll = new Poll();
    newPoll.title = req.body.title;
    newPoll.authorId = req.user._id;
    newPoll.options = req.body.option.filter((opt) => opt != '').map((opt) => {
      const optAux = [];
      if (opt != "") {
        return {
          option: opt,
          votes: 0
        };
      }
    });
    
    newPoll.save((err) => {
      if (err) {
        console.log(err);
      }
    })
    res.redirect('/');
  });
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}