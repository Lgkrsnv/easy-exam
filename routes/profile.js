const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Order = require('../models/order');

const { sessionChecker } = require('../middleware/auth');

const router = express.Router();


/* GET home page. */

// router.route('/')
//   .get(sessionChecker, async (req, res) => {
//     const { mydata } = req.query;
//     const { neworder } = req.query;
//     console.log(neworder);
//     const myUser = await User.findOne({ email: req.session.user.email }).lean();
//     console.log(myUser);
//     if (mydata || neworder) {
//       return res.render('profile', { mydata, neworder });
//     }
//   })

router.route('/').get(sessionChecker, async (req, res) => {
  const {
    mydata, successorder, myorders, neworder, allorders,
  } = req.query;
  const myUser = await User.findOne({ email: req.session.user.email }).populate('orders');
  const orders = await Order.find();

  if (mydata || successorder || myorders || neworder || allorders) {
    return res.render('profile', {
      mydata, myorders, successorder, neworder, myUser, allorders, orders,
    });
  }
})
  .put(sessionChecker, async (req, res, next) => {
    try {
      const { name, email, phone } = req.body;
      const users = await User.find({ email })
      console.log(users)


      const user = await User.findOneAndUpdate({ email: req.session.user.email }, { $set: { name, email, phone } }, { returnOriginal: false });
      req.session.user = user;
      res.sendStatus(200);

    } catch (error) {
      res.sendStatus(500);
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

router.route('/password').put(sessionChecker, async (req, res) => {
  try {
    const { password } = req.body;
    const newPassword = req.body.password1;
    const user = await User.findOne({ email: req.session.user.email });
    if (await bcrypt.compare(password, user.password)) {
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    res.sendStatus(500);
  }
});
module.exports = router;
