const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({

  messages: [
    // time, 
    // author, 
    String,
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  socketId: String,
},
{
  timestamps: true,
});

module.exports = mongoose.model('Chat', chatSchema);
