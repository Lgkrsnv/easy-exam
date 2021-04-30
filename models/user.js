const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(value) {
        return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value);
      },
      message: 'is not a valid phone number!',
    },
  },
  phone: {
    type: String,
    validate: {
      validator(value) {
        return /^((8|\+7)[/\- ]?)?(\(?\d{3}\)?[/\- ]?)?[\d\- ]{7,10}$/.test(value);
      },
      message: 'is not a valid phone number!',
    },
  },
  password: { type: String, required: true },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  canselledOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  role: String,
  // messages: [{time, author, textmessage}],
  // userId,
  // adminId
},
{
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
