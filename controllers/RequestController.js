const Request = require('../models/Request');
const UserDetail = require('../models/UserDetail');

exports.createRequest = async (req, res) => {
  const mentorId = req.params.mentorId;
  const learnerId = req.user._id;
  
  try {
    const mentor = await UserDetail.findOne({ user: mentorId, role: 'mentor' });
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    // Fetch learner details to get the first name
    const learnerDetails = await UserDetail.findOne({ user: learnerId, role: 'learner' });
    if (!learnerDetails) {
      return res.status(404).json({ error: 'Learner not found' });
    }
    
    const { firstName } = learnerDetails; // Extract learner's first name
    const { classType, classTime } = req.body;

    const request = new Request({
      mentor: mentorId,
      learner: learnerId,
      learnerFirstName: firstName, // Assign learner's first name
      classType,
      classTime,
    });
    await request.save();

    res.status(201).json({ message: 'Request created successfully', request });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getRequestsByMentor = async (req, res) => {
  const mentorId = req.user._id; // Assuming the user ID is available in req.user

  try {
    console.log('Mentor ID:', mentorId); // Log mentor ID for debugging
    const requests = await Request.find({ mentor: mentorId });
    console.log('Requests:', requests); // Log requests for debugging
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error getting requests:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateRequestStatus = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  try {
    const request = await Request.findByIdAndUpdate(requestId, { status }, { new: true });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.status(200).json({ message: 'Request status updated successfully', request });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.getRequestStatusForLearner = async (req, res) => {
  const learnerId = req.user._id; // Assuming the user ID is available in req.user

  try {
    // Find the request where the learner ID matches and populate the mentor details
    const request = await Request.findOne({ learner: learnerId }).populate('mentor', 'firstName lastName');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ status: request.status, mentor: request.mentor });
  } catch (error) {
    console.error('Error getting request status for learner:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.getRequestStatusForLearnerr = async (req, res) => {
  const learnerId = req.user._id; // Assuming the user ID is available in req.user

  try {
    const requests = await Request.find({ learner: learnerId });

    if (!requests || requests.length === 0) {
      return res.status(404).json({ message: 'No requests found for the learner' });
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error getting request status for learner:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};