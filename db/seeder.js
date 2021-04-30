require('dotenv').config();
const mongoose = require('mongoose');
const dbConnect = require('./dbConnect');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Order = require('../models/order');

dbConnect();

async function seeder() {
  // const seedOrder = {
  //   username: 'Владимир',
  //   type: 'диплом',
  //   pages: 40,
  //   deadline: '07.05.2021',
  //   sources: 15,
  //   originality: '71-80%',
  //   subject: 'Международные отношения',
  //   topic: 'Автомобильный рынок Республики Корея',
  //   font: '14 шрифт, одинарный интервал',
  //   authorQualifications: 'Кандидат наук',
  //   guarantee: 'гарантия 4 месяца',
  //   requirements: 'Предварительный созвон',
  //   promoCode: 'NEWUSER2021',
  // };

  // const newOrder = await Order.create(seedOrder);

  // const seedUser = {
  //   name: 'Мельников Владимир',
  //   email: 'qwerty@gmail.com',
  //   phone: 9999992312,
  //   password: '123',
  //   orders: newOrder.id,
  // };

  // await User.create(seedUser);


  // const seedUser = {
  //   name: 'Админ',
  //   email: 'qwerty123@gmail.com',
  //   password: await bcrypt.hash('123', 10),
  //   role: 'admin',
  // };
  const userId = await User.findOne({ email: 'qwerty123@gmail.com' });
  console.log(userId);

  mongoose.disconnect();
}

seeder();
