const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  username: { type: String },
  type: { type: String, required: true },
  pages: { type: Number, required: true },
  number: {
    type: Number,
    default: 0,
  },
  deadline: { type: String },
  sources: { type: Number },
  foreignSources: { type: Boolean },
  originality: { type: String },
  plagiat: { type: String },
  plagiReport: { type: Boolean },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  font: { type: String },
  university: { type: String },
  authorQualifications: { type: String },
  requirements: { type: String },
  file: {},
},
{
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
