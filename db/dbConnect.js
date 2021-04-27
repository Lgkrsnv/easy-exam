require('dotenv').config();
const mongoose = require('mongoose');

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

const dbConnect = () => {
  mongoose.connect(process.env.DATABASE_STRING, options).then(() => {
    try {
      console.log('DB connected');
    } catch (e) {
      console.log(e);
    }
  });
};

module.exports = dbConnect;
