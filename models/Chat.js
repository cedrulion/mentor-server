const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetail',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetail',
    required: true
  },
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetail',
        required: true
      },
      message: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
