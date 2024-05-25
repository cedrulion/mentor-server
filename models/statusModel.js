const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
  isEnabled: {
    type: Boolean,
    default: false // Initially disabled
  }
});

module.exports = mongoose.model('Status', StatusSchema);
