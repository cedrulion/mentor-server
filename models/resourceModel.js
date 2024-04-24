const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Webinar', 'Video', 'Article'],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  // Optional: You can add more fields based on your requirements
  videoExtension: String,
  videoUrl: String,
  articleExtension: String,
  articleUrl: String,
  webinarUrl: String,
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
