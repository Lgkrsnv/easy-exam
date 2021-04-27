const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
 
  res.render('index');
});
router.post('/', async function(req, res, next) {
 const { file } = req.body;
 console.log(file);
  res.json('file', { file });
});
module.exports = router;
