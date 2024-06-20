const Skill = require('../models/Skill');

// Create a new skill
exports.createSkill = async (req, res) => {
  try {
    const { userId, sname, description } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    const skill = new Skill({
      user: userId,
      sname,
      description,
    });

    await skill.save();

    res.status(201).json({ success: true, data: skill });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all skills of a user
exports.getUserSkills = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    const skills = await Skill.find({ user: userId });

    res.status(200).json({ success: true, data: skills });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a single skill by ID
exports.getSkillById = async (req, res) => {
  try {
    const skillId = req.params.id;

    if (!skillId) {
      return res.status(400).json({ success: false, error: 'Skill ID is required' });
    }

    const skill = await Skill.findById(skillId);

    if (!skill) {
      return res.status(404).json({ success: false, error: 'Skill not found' });
    }

    res.status(200).json({ success: true, data: skill });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update a skill
exports.updateSkill = async (req, res) => {
  try {
    const skillId = req.params.id;
    const { sname, description } = req.body;

    if (!skillId) {
      return res.status(400).json({ success: false, error: 'Skill ID is required' });
    }

    const skill = await Skill.findByIdAndUpdate(
      skillId,
      { sname, description },
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({ success: false, error: 'Skill not found' });
    }

    res.status(200).json({ success: true, data: skill });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a skill
exports.deleteSkill = async (req, res) => {
  try {
    const skillId = req.params.id;

    if (!skillId) {
      return res.status(400).json({ success: false, error: 'Skill ID is required' });
    }

    const skill = await Skill.findByIdAndDelete(skillId);

    if (!skill) {
      return res.status(404).json({ success: false, error: 'Skill not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
