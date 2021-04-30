const express = require('express');
const { sessionChecker } = require('../middleware/auth');


const router = express.Router();

router.route('/').get(async (req, res) => {
  res.render('sucsess', { message: 'Регистрация успешно завершена' });
});

module.exports = router;
