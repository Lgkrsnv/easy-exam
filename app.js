const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const express = require('express');
const session = require('express-session');

const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const multer = require('multer');
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const dbConnect = require('./db/dbConnect');

const { userJoin, getCurrentUser } = require('./middleware/chatUsers');
const formatMessage = require('./middleware/chatMessages');

const Order = require('./models/order');
const User = require('./models/user');

const indexRouter = require('./routes/index');
const profileRouter = require('./routes/profile');
const orderRouter = require('./routes/order');
const sucseesRouter = require('./routes/sucsess');
const registrationRouter = require('./routes/registration');
const { cookiesCleaner } = require('./middleware/auth');
const chat = require('./models/chat');

dbConnect();

const conn = mongoose.connection;
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

// Init gfs
let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.DATABASE_STRING,
  file: (req, file) => new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, buf) => {
      if (err) {
        return reject(err);
      }
      const filename = buf.toString('hex') + path.extname(file.originalname);
      const fileInfo = {
        filename: filename,
        bucketName: 'uploads',
      };
      resolve(fileInfo);
    });
  }),
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  const {
    type,
    pages,
    deadline,
    sources,
    foreignSources,
    originality,
    plagiat,
    plagiReport,
    subject,
    topic,
    font,
    university,
    authorQualifications,
    requirements,
  } = req.body;

  const numb = (min, max) => Math.floor(Math.random() * (max - min) + min);
  ;
  const allOrders = await Order.find();
  const orderNum = numb(10, 1000);
  const newOrder = await Order.create({
    username: req.session.user.name,
    type,
    pages,
    number: orderNum,
    deadline,
    sources,
    foreignSources,
    originality,
    plagiat,
    plagiReport,
    subject,
    topic,
    font,
    university,
    authorQualifications,
    requirements,
    file: req.file,
  });

  await User.findOneAndUpdate(
    { name: req.session.user.name },
    { $push: { orders: newOrder.id } },
    { returnOriginal: false },
  );

  return res.redirect('/profile?myorders=2');
});

app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist',
      });
    }

    // Files exist
    return res.json(files);
  });
});

app.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists',
      });
    }
    // File exists
    if (file.contentType === 'text/plain') {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    }
    // return res.send(file);
  });
});

const botName = 'Elbrus Bot';

io.on('connection', async (socket) => {
  // const projects = await fetchProjects(socket);
  const author = socket.request.session.user.name;
  socket.emit('getName', author);

  console.log('Connection Ready');

  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit('message', formatMessage(botName, 'Администратор ответит в ближайшее время...'));

    socket.broadcast
      .to(user.room)
      .emit('message', formatMessage(botName, `${user.username} has joined the chat`));
  });

  socket.on('chatMessage', async msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  socket.on('msgToDb', async (message) => {
    console.log(message);
    await chat.create({ new: message });
  });
});

app.use(cookiesCleaner);

app.use((req, res, next) => {
  // console.log(req.session.username);
  if (req.session.user) {
    res.locals.name = req.session.user.name;
    res.locals.email = req.session.user.email;
    res.locals.phone = req.session.user.phone;
    res.locals.admin = req.session.user.role;
    // console.log('req.session ==>', req.session);
  }
  next();
});

app.use('/', indexRouter);
app.use('/profile', profileRouter);
app.use('/order', orderRouter);
app.use('/login', sucseesRouter);
app.use('/signup', registrationRouter);
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

module.exports = {
  app, http,
};
