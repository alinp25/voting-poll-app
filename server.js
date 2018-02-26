const express      = require("express");
const app          = express();
const mongoose     = require("mongoose");
const morgan       = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser   = require("body-parser");
const session      = require('express-session');
const passport     = require('passport');
const path         = require('path');
const flash        = require('connect-flash');

const configApp    = require('./config/application');

const PORT = process.env.PORT || 8080;

mongoose.connect(configApp.database);

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded( {extended: false} ));
app.use(bodyParser());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/public/views'));

app.use(session({ secret: configApp.secret, saveUninitialized: false, resave: false, cookie: {secureProxy: true, httpOnly: true, expires: Date.now() + 120*60*1000} }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes')(app, passport);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
