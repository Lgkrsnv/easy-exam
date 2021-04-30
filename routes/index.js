const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const User = require('../models/user');
const { upload, gfs, storage } = require('../app');
/* GET home page. */

const saltRounds = 10;

router
  .route('/')
  .get((req, res) => {
    res.render('index');
  });

// router.post('/upload', upload.single('file'), (req, res) => {
//   res.json({ file: req.file });
//   // res.redirect('/');
// });

router.get('/files', (req, res) => {
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

router.get('/files/:filename', (req, res) => {
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

router
  .route('/signup')
  .post(async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const user = await User.create({
        name,
        email,
        password: await bcrypt.hash(password, saltRounds),
      });
      req.session.user = user;
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(501);
    }
  });

router
  .route("/login")

  .post(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user;
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  });

router.get("/logout", async (req, res, next) => {
  if (req.session.user) {
    try {
      await req.session.destroy();
      res.clearCookie("user_sid");
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  }
});

// router.get('/chat', async (req, res) => {
//   // res.render('chat');
//   res.render('chat');
// });

// передаем имя сессии для чата

router.get('/chatInfo', async (req, res) => {
  const getUser = req.session.user.name;
  res.json({ getUser });
});

module.exports = router;
