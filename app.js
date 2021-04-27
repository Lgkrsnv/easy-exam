const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dbConnect = require('./db/dbConnect');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const indexRouter = require('./routes/index');

const app = express();
// dbConnect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const options = {
  store: MongoStore.create({mongoUrl: 'mongodb://localhost:27017/studentProject'}),
  key: "user_sid",
  secret: "panda",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 1000 * 60 * 30,
  },
};

app.use(session(options));

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
