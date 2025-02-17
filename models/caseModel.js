const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const caseSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedLawyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    default: 'PENDING'
  },
  legalCategory: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM'
  },
  attachments: [String], // Array of file URLs
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  notes: [
    {
      text: String,
      author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

// Update the updatedAt timestamp on save
caseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;