// models/UserDetail.js
const mongoose = require('mongoose');

const userDetailSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  studyField: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
 
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
});

const UserDetail = mongoose.model('UserDetail', userDetailSchema);

module.exports = UserDetail;
