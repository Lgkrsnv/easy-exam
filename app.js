const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dbConnect = require('./db/dbConnect');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const profileRouter = require('./routes/profile');
const orderRouter = require('./routes/order');
const { cookiesCleaner } = require('./middleware/auth');

const app = express();
dbConnect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

const options = {
  store: MongoStore.create({ mongoUrl: process.env.DATABASE_STRING }),
  key: 'user_sid',
  secret: 'panda',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 1000 * 60 * 30,
  },
};

app.use(session(options));


app.use(cookiesCleaner);

app.use((req, res, next) => {
  // console.log(req.session.username);
  if (req.session.user) {
    res.locals.name = req.session.user.name;
    res.locals.email = req.session.user.email;
    res.locals.admin = req.session.user.role;
    console.log('req.session ==>', req.session);
  }
  next();
});


app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/profile', profileRouter);
app.use('/order', orderRouter);
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
