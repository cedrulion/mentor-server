const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetail',
    required: true,
  },
  learner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetail',
    required: true,
  },
  learnerFirstName: {
    type: String,
    ref: 'UserDetail', 
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  },
  classType: {
    type: String,
    enum: ['in person', 'online', 'workshops', 'one-one'],
    required: true,
  },
  classTime: {
    type: Date,
    required: true,
  },
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
