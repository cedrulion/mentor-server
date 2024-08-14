// userModel
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  confirmPassword: {
    type: String,
  },
  phone: {
    type: String,
  },
 role: {
        type: String,
        enum: ["CLIENT", "LAWYER"]
    },
  country: {
    type: String,
  },
  areasOfLaw: {
    type: [String], // Array of strings
  },
  barRegNumber: {
    type: String,
  },
  lawFirm: {
    type: String,
  },
  officeAddress: {
    type: String,
  },
  address: {
    type: String,
  },
  yearsOfExperience: {
    type: Number,
  },
  legalSpecification: {
    type: String,
  },
  areasOfLegalSpecification: {
    type: [String], // Array of strings
  },
  specificLegalSpecifications: {
    type: [String], // Array of strings
  },
  lawSchoolAttended: {
    type: String,
  },
  graduatedYear: {
    type: Number,
  },
  certificate: {
    type: String,
  },
  previousLawFirm: {
    type: String,
  },
  membership: {
    type: String,
  },
  portfolio: {
    type: String, // Assuming this is a link
  },
  languages: {
    type: [String], // Array of strings
  },
  feePerHour: {
    type: Number,
  },
  availability: {
    type: String,
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
