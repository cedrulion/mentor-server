const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetail',
    required: true,
  },
  mentorFirstName: {
    type: String,
    ref: 'UserDetail', 
  },
  mentorLastName: {
    type: String,
    ref: 'UserDetail', 
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
  learnerLastName: {
    type: String,
    ref: 'UserDetail', 
  },
  message: {
    type: String,
    required: true,
  },
  replies: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetail',
      },
      message: String,
    }
  ],
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  upvoteUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetail',
  }],
  downvoteUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetail',
  }],
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
