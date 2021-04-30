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
const Chat = require('./models/chat');
const User = require('./models/user');
const app = express();

const http = require('http').createServer(app);
// const socketServer = require("socket.io")(http);
const io = require('socket.io')(http);


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

const sessionMiddleware = session(options);

app.use(sessionMiddleware);

// подключаем middleware сессий для сокетов
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

// io.sockets.on('connection', (socket) => {
//   console.log("Connected user");
//   socket.on('join', (msg) => {
//     socket.join(msg.name); // We are using room of socket io
//     io.sockets.in(msg.name).emit('new_msg', {new_msg: 'hello'});
//   });
// });

io.on('connection', (socket) => {
  console.log('Connection Ready');
  console.log("socket befoooooooooooooooooooore", socket.id);

  socket.on('sendFirstMessage', async (msg) => {

    // console.log(Object.keys(io.sockets.sockets));
    // console.log(msg);
    // console.log(socket.rooms);
    // console.log(socket.id);
    console.log(socket);
    const author = socket.request.session.user;
    // console.log(author);
    const admin = await User.findOne({ _id: '6088445269149c8c5443244d' });
    // console.log(admin);
    let newChat = await Chat.create({ messages: msg.message, socketId: msg.socketId });
    const user = await User.findOne({ email: author.email });
    // console.log(user);
    newChat = await Chat.findByIdAndUpdate({ _id: newChat.id }, { admin: admin.id, user: user.id });
    // console.log(newChat);
    socket.broadcast.emit('sendToAll', msg);
    // отправка на индивидуальный socketid (личное сообщение)
    //     io.to(`${socketId}`).emit('hey', 'I just met you');

    // ВНИМАНИЕ: `socket.to(socket.id).emit()` НЕ будет работать, как бы мы отправляли сообщение всем в комнату
    // `socket.id`, а не отправителю. Вместо этого, используйте `socket.emit()`.
  });
});

app.use(cookiesCleaner);

app.use((req, res, next) => {
  // console.log(req.session.username);
  if (req.session.user) {
    res.locals.name = req.session.user.name;
    res.locals.email = req.session.user.email;
    res.locals.admin = req.session.user.role;
    // console.log('req.session ==>', req.session);
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

module.exports = { app, http };


//6088445269149c8c5443244d
