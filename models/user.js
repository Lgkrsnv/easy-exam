const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
},
{
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
