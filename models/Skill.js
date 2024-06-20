const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sname: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
