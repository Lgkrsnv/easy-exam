const express = require('express');

const router = express.Router();

/* GET home page. */
router.post('/', async (req, res) => {
  console.log(req.body);
  
  res.sendStatus(200);
});

module.exports = router;
