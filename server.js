const express      = require("express");
const app          = express();
const mongoose     = require("mongoose");
const morgan       = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser   = require("body-parser");
const session      = require('express-session');
const passport     = require('passport');

const configApp    = require('./config/application');

const PORT = process.env.PORT || 8080;

// mongoose.connect(configApp.database);

// To be updated => Passport configuration
// require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded( {extended: false} ));
app.use(bodyParser());

app.set('view engine', 'pug');

app.use(session({ secret: configApp.secret }));
app.use(passport.initialize());
app.use(passport.session());

// require('./app/routes')(app, passport);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
