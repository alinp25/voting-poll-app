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
    if (req.user) {
      return res.redirect('/');
    }
    res.render("login", { message: req.flash("loginMessage") });
  });

  app.post( 
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true
    })
  );

  app.get("/signup", (req, res) => {
    if (req.user) {
      return res.redirect('/');
    }
    res.render("signup", { message: req.flash("signupMessage") });
  });

  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/",
      failureRedirect: "/signup",
      failureFlash: true
    })
  );

  app.get("/auth/twitter", passport.authenticate("twitter"));

  app.get(
    "/auth/twitter/callback",
    passport.authenticate("twitter", {
      successRedirect: "/mypolls",
      failureRedirect: "/"
    })
  );

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
    if (req.user) {
      const newPoll = new Poll();
      newPoll.title = req.body.title;
      newPoll.authorID = req.user._id;
      if (!req.body.option) {
        return res.redirect("/");
      }
      if (typeof req.body.option === "string" && req.body.option != "") {
        newPoll.votes = [0];
        newPoll.labels = [req.body.option];
      } else {
        // newPoll.options = req.body.option.filter(opt => opt != "").map(opt => {
        //   const optAux = [];
        //   if (opt != "") {
        //     return {
        //       option: opt,
        //       votes: 0
        //     };
        //   }
        // });
        newPoll.labels = req.body.option.filter(opt => opt != "");
        newPoll.votes = [];
        newPoll.votes.length = newPoll.labels.length;
        newPoll.votes.fill(0);
        newPoll.usersVoted = [""];
        newPoll.ipsVoted = [""];
      }

      newPoll.save(err => {
        if (err) {
          console.log(err);
        }
      });
    }
    res.redirect("/");
  });

  app.get("/mypolls", isLoggedIn, (req, res) => {
    Poll.find({ authorID: req.user._id }, (err, polls) => {
      if (err) {
        console.log(err);
        res.send("Server problems! ERROR 404!");
      }
      res.render("mypolls", { user: req.user, pollsList: polls });
    });
  });

  app.get("/delete/:id", (req, res) => {
    if (req.user)
      Poll.findById(req.params.id, (err, poll) => {
        if (err) {
          console.log(err);
        }

        if (poll.authorID == req.user._id) {
          Poll.findByIdAndRemove(req.params.id, err => {
            if (err) {
              console.log(err);
            }
          });
          res.redirect("/mypolls");
        } else {
          res.redirect("/");
        }
      });
    else res.redirect("/");
  });

  app.get("/poll/:id", (req, res) => {
    Poll.findById(req.params.id, (err, poll) => {
      if (err) {
        console.log(err);
      }
      if (!poll) {
        return res.redirect("/");
      }
      res.render("poll", { poll, user: req.user });
    });
  });

  app.get("/poll/:id/update/:option", (req, res) => {
    const optToUpdate = `votes.${req.params.option}`;
    const ipAddress =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    Poll.findById(req.params.id, (err, poll) => {
      if (req.user) {
        if (poll.usersVoted.indexOf(req.user._id) > -1) {
          console.log('You already voted!');
          return res.redirect(`/poll/${req.params.id}`);
        } else {
          Poll.findByIdAndUpdate(
              req.params.id,
              { $inc: { [optToUpdate]: 1 },
                $push: { usersVoted: req.user._id } },
              (err, poll) => {
                if (err) {
                  console.log(err);
                }        
                return res.redirect(`/poll/${req.params.id}`);
              }
            );
        }
      } else {
        if (poll.ipsVoted.indexOf(ipAddress) > -1) {
          console.log('You already voted!');
          return res.redirect(`/poll/${req.params.id}`);
        } else {
          Poll.findByIdAndUpdate(
              req.params.id,
              { $inc: { [optToUpdate]: 1 },
                $push: { ipsVoted: ipAddress } },
              (err, poll) => {
                if (err) {
                  console.log(err);
                }        
                return res.redirect(`/poll/${req.params.id}`);
              }
            );
        }
      }
    });
    // Poll.findByIdAndUpdate(
    //   req.params.id,
    //   { $inc: { [optToUpdate]: 1 } },
    //   (err, poll) => {
    //     if (err) {
    //       console.log(err);
    //     }

    //     return res.redirect(`/poll/${req.params.id}`);
    //   }
    // );
  });

  app.get("/poll/:id/add/:option(*)", isLoggedIn, (req, res) => {
    Poll.findByIdAndUpdate(
      req.params.id,
      { $push: { labels: req.params.option, votes: 1 } },
      (err, poll) => {
        if (err) {
          console.log(err);
        }
        return res.redirect(`/poll/${req.params.id}`);
      }
    );
  });

  app.get("*", (req, res) => {
    res.redirect("/");
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}
