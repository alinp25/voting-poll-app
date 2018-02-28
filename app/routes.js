const Poll = require("./models/poll");

module.exports = (app, passport) => {
  app.get("/", (req, res) => {
    Poll.find({}, (err, polls) => {
      if (err) {
        console.log(err);
        res.send("Server problems! ERROR 404!");
      }
      res.render("index", { user: req.user, pollsList: polls });
    });
  });

  app.get("/login", (req, res) => {
    res.render("login", { message: req.flash("loginMessage") });
  });

  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/mypolls",
      failureRedirect: "/login",
      failureFlash: true
    })
  );

  app.get("/signup", (req, res) => {
    res.render("signup", { message: req.flash("signupMessage") });
    // res.render('signup');
  });

  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/",
      failureRedirect: "/signup",
      failureFlash: true
    })
  );

  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/mypolls',
    failureRedirect: '/'
  }))

  app.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect("/");
  });

  app.get("/newpoll", (req, res) => {
    if (req.isAuthenticated()) {
      res.render("newpoll", { user: req.user });
    } else {
      res.redirect("/");
    }
  });

  app.post("/newpoll", (req, res) => {
    const newPoll = new Poll();
    newPoll.title = req.body.title;
    newPoll.authorID = req.user._id;
    if (!req.body.option) {
      return res.redirect('/');
    }
    if (typeof req.body.option === "string" && req.body.option != "") {
      newPoll.options = [
        {
          option: req.body.option,
          votes: 0
        }
      ];
    } else {
      newPoll.options = req.body.option.filter(opt => opt != "").map(opt => {
        const optAux = [];
        if (opt != "") {
          return {
            option: opt,
            votes: 0
          };
        }
      });
    }

    newPoll.save(err => {
      if (err) {
        console.log(err);
      }
    });
    res.redirect("/");
  });

  app.get("/mypolls", (req, res) => {
    Poll.find({ authorID: req.user._id }, (err, polls) => {
      if (err) {
        console.log(err);
        res.send("Server problems! ERROR 404!");
      }
      res.render("mypolls", { user: req.user, pollsList: polls });
    });
  });

  app.get("/delete/:id", (req, res) => {
     Poll.findByIdAndRemove(req.params.id, (err, poll) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/mypolls');
     });
  });

  app.get("/poll/:id", (req, res) => {
    Poll.findById(req.params.id, (err, poll) => {
      if (err) {
        console.log(err);
      }
      res.render('poll', {poll});
    });
  })
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/");
}
