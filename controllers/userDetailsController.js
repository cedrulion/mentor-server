// controllers/UserDetailController.js
const UserDetail = require('../models/UserDetail');

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

exports.getUserDetail = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract userId from route parameter
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
