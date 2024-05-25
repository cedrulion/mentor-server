const Status = require('../models/statusModel');

// Get status
exports.getStatus = async (req, res) => {
  try {
    let status = await Status.findOne();
    if (!status) {
      status = new Status();
      await status.save();
    }
    res.json({ isEnabled: status.isEnabled });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Enable status
exports.enableStatus = async (req, res) => {
  try {
    let status = await Status.findOne();
    if (!status) {
      status = new Status();
    }
    status.isEnabled = true;
    await status.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Disable status
exports.disableStatus = async (req, res) => {
  try {
    let status = await Status.findOne();
    if (!status) {
      status = new Status();
    }
    status.isEnabled = false;
    await status.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};
