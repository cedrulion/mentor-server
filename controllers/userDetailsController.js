// controllers/UserDetailController.js
const UserDetail = require('../models/UserDetail');
const mongoose = require('mongoose');

exports.createUserDetail = async (req, res) => {
  const { firstName, lastName, role, school, university, studyField, dob, country, city, street } = req.body;
  const userId = req.user._id;

  try {
    // Ensure that all required fields are present
    if (!firstName || !lastName || !role || !school || !university || !studyField || !dob || !country || !city || !street) {
      return res.status(400).json({ error: 'Missing required fields for user detail creation' });
    }

    const userDetail = new UserDetail({
      user: userId,
      firstName,
      lastName,
      role,
      school,
      university,
      studyField,
      dob,
      country,
      city,
      street,
    });

    await userDetail.save();

    res.json({ message: 'User detail created successfully!', userDetail });
  } catch (error) {
    console.error('Error creating user detail:', error);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
};

// Controller to fetch user details
exports.getUserDetail = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const userDetail = await UserDetail.findOne({ user: userId });

    if (!userDetail) {
      return res.status(404).json({ message: 'User detail not found' });
    }

    res.json(userDetail);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const userDetail = await UserDetail.findOne({ user: userId });

    if (!userDetail) {
      return res.status(404).json({ message: 'User detail not found' });
    }

    res.status(200).json(userDetail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const allUserDetails = await UserDetail.find({ role: 'mentor' });
    res.status(200).json(allUserDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getAllUser= async (req, res) => {
  try {
    const allUserDetails = await UserDetail.find({});
    res.status(200).json(allUserDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getUserDetailById = async (req, res) => {
  try {
    const userDetailId = req.params.id;
    const userDetail = await UserDetail.findById(userDetailId);

    if (!userDetail) {
      return res.status(404).json({ message: 'User detail not found' });
    }

    res.status(200).json(userDetail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.deleteUserDetail = async (req, res) => {
  try {
    const userDetailId = req.params.id;
    const userDetail = await UserDetail.findByIdAndDelete(userDetailId);

    if (!userDetail) {
      return res.status(404).json({ message: 'User detail not found' });
    }

    res.status(200).json({ message: 'User detail deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to add review to a user
exports.addReview = async (req, res) => {
  const { review } = req.body;

  // Ensure review is a number
  const reviewScore = parseFloat(review);

  if (isNaN(reviewScore) || reviewScore < 0 || reviewScore > 5) {
    return res.status(400).json({ message: 'Review value must be a number between 0 and 5' });
  }

  try {
    const mentorId = req.params.mentorId;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).json({ message: 'Invalid mentor ID' });
    }

    // Fetch the mentor's details
    let mentorDetail = await UserDetail.findOne({ user: mentorId });

    if (!mentorDetail) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Check if this user has already reviewed this mentor
    const existingReviewIndex = mentorDetail.reviews.findIndex(r => r.user.toString() === userId.toString());

    if (existingReviewIndex !== -1) {
      // Update existing review
      mentorDetail.reviews[existingReviewIndex].review = reviewScore;
    } else {
      // Add new review
      mentorDetail.reviews.push({ user: userId, review: reviewScore });
    }

    // Save the updated mentor details
    mentorDetail = await mentorDetail.save();

    res.json(mentorDetail); // Return updated mentor details
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};