const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  username: { type: String },
  type: { type: String, required: true },
  pages: { type: Number, required: true },
  deadline: { type: String },
  sources: { type: Number },
  originality: { type: String },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  font: { type: String },
  university: { type: String },
  authorQualifications: { type: String },
  guarantee: { type: String },
  requirements: { type: String },
  promoCode: { type: String },
},
{
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
