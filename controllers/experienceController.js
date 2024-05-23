const Experience = require('../models/Experience');

// Create a new experience
exports.createExperience = async (req, res) => {
  try {
    const { userId, title, description, startDate, endDate } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    const experience = new Experience({
      user: userId,
      title,
      description,
      startDate,
      endDate,
    });

    await experience.save();

    res.status(201).json({ success: true, data: experience });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all experiences of a user
exports.getUserExperiences = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    const experiences = await Experience.find({ user: userId });

    res.status(200).json({ success: true, data: experiences });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a single experience by ID
exports.getExperienceById = async (req, res) => {
  try {
    const experienceId = req.params.id;

    if (!experienceId) {
      return res.status(400).json({ success: false, error: 'Experience ID is required' });
    }

    const experience = await Experience.findById(experienceId);

    if (!experience) {
      return res.status(404).json({ success: false, error: 'Experience not found' });
    }

    res.status(200).json({ success: true, data: experience });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update an experience
exports.updateExperience = async (req, res) => {
  try {
    const experienceId = req.params.id;
    const { title, description, startDate, endDate } = req.body;

    if (!experienceId) {
      return res.status(400).json({ success: false, error: 'Experience ID is required' });
    }

    const experience = await Experience.findByIdAndUpdate(
      experienceId,
      { title, description, startDate, endDate },
      { new: true, runValidators: true }
    );

    if (!experience) {
      return res.status(404).json({ success: false, error: 'Experience not found' });
    }

    res.status(200).json({ success: true, data: experience });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete an experience
exports.deleteExperience = async (req, res) => {
  try {
    const experienceId = req.params.id;

    if (!experienceId) {
      return res.status(400).json({ success: false, error: 'Experience ID is required' });
    }

    const experience = await Experience.findByIdAndDelete(experienceId);

    if (!experience) {
      return res.status(404).json({ success: false, error: 'Experience not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
