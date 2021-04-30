const express = require('express');
const { sessionChecker } = require('../middleware/auth');
const User = require('../models/user');
const Order = require('../models/order');

const router = express.Router();

router.route('/:id').delete(async (req, res) => {
  console.log(req.params);
  try {
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
});

module.exports = router;
