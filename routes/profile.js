const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const User = require('../models/user');
// const upload = require('../app');
const { sessionChecker } = require('../middleware/auth');
const storage = require('../app');

const router = express.Router();
const upload = multer({ storage });

/* GET home page. */
router.route('/')
  .get(sessionChecker, async (req, res) => {
    const { mydata } = req.query;
    const { neworder } = req.query;
    console.log(neworder);
    const myUser = await User.findOne({ email: req.session.user.email }).lean();
    console.log(myUser);
    if (mydata || neworder) {
      return res.render('profile', { mydata, neworder });
    }
  })

  // .post('/upload', upload.single('file'), (req, res) => {
  //   // const upload = multer({ storage }).single('file');
  //   // upload(req, res, (err) => {
  //   //   if (err) {
  //   //     return res.end('error uploading file');
  //   //   }
  //   //   res.end('File if uploaded!');
  //   // });
  //   res.json({ file: req.file });
  // })

  .put(sessionChecker, async (req, res) => {
    try {
      console.log(req.body);
      const { name, email, phone } = req.body;
      const user = await User.findOneAndUpdate({ email: req.session.user.email }, { $set: { name, email, phone } }, { returnOriginal: false });
      req.session.user = user;
      res.sendStatus(200);
    } catch (error) {
      res.render('error', { error });
    }
  }).delete(sessionChecker, async (req, res) => {
    try {
      await User.findOneAndRemove({ email: req.session.user.email });
      await req.session.destroy();
      res.clearCookie('user_sid');
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  });

router.route('/password').put(sessionChecker, async (req, res, next) => {
  console.log(req.body);
  try {
    const { password } = req.body;
    const newPassword = req.body.password1;
    const user = await User.findOne({ email: req.session.user.email });
    if (await bcrypt.compare(password, user.password)) {
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      res.sendStatus(200);
    }
  } catch (error) {
    res.sendStatus(500);
  }
});
module.exports = router;
