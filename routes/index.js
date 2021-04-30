const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

/* GET home page. */

const saltRounds = 10;

router
  .route('/')
  .get((req, res) => {
    res.render('index');
  });

router
  .route('/signup')
  .post(async (req, res, next) => {
    try {
      const { name, email, password, phone } = req.body;
      const user = await User.create({
        name,
        email,
        phone,
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
