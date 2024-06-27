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
 date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ['Webinar', 'Video', 'Article', 'Module'],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filePath: {
    type: String,
    
  },
  // Optional: You can add more fields based on your requirements
  videoExtension: String,
  videoUrl: String,
  moduleExtension: String,
  moduleUrl: String,
  articleExtension: String,
  articleUrl: String, 
  webinarUrl: {
    type: String,
    validate: {
      validator: function (v) {
        return /^https?:\/\/.*/.test(v); // simple URL validation
      },
      message: props => `${props.value} is not a valid URL!`
    },
    required: function() { return this.type === 'Webinar'; },
  },
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
