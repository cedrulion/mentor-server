const Question = require('../models/Question');
const Request = require('../models/Request');
const UserDetail = require('../models/UserDetail');

exports.askQuestionToMentor = async (req, res) => {
  const learnerId = req.user._id;
  const { message } = req.body;

  try {
    const request = await Request.findOne({ learner: learnerId, status: 'accepted' });
    if (!request) {
      return res.status(404).json({ message: 'Your request is not accepted yet' });
    }
    const learnerDetails = await UserDetail.findOne({ user: learnerId, role: 'learner' });
    if (!learnerDetails) {
      return res.status(404).json({ error: 'Learner not found' });
    }

    const { firstName } = learnerDetails;

    const question = new Question({
      mentor: request.mentor,
      learnerFirstName: firstName,
      learner: learnerId,
      message,
    });
    await question.save();

    res.status(201).json({ message: 'Question sent to mentor', question });
  } catch (error) {
    console.error('Error asking question to mentor:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getQuestions = async (req, res) => {
  const userId = req.user._id;
  const userRole = req.user.role;

  try {
    let questions;
    if (userRole === 'learner') {
      questions = await Question.find({ learner: userId });
    } else if (userRole === 'mentor') {
      questions = await Question.find({ mentor: userId });
    } else {
      questions = await Question.find();
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error('Error getting questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.upvoteQuestion = async (req, res) => {
  const { questionId } = req.params;
  const userId = req.user._id;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.upvoteUsers.includes(userId)) {
      return res.status(400).json({ message: 'You have already upvoted this question' });
    }

    question.upvoteUsers.push(userId);
    question.upvotes += 1; // Increment upvotes count
    await question.save();

    res.status(200).json({ message: 'Question upvoted successfully', question });
  } catch (error) {
    console.error('Error upvoting question:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.downvoteQuestion = async (req, res) => {
  const { questionId } = req.params;
  const userId = req.user._id;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.downvoteUsers.includes(userId)) {
      return res.status(400).json({ message: 'You have already downvoted this question' });
    }

    question.downvoteUsers.push(userId);
    question.downvotes += 1; // Increment downvotes count
    await question.save();

    res.status(200).json({ message: 'Question downvoted successfully', question });
  } catch (error) {
    console.error('Error downvoting question:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.replyToQuestion = async (req, res) => {
  const userId = req.user._id;
  const { reply } = req.body;
  const { questionId } = req.params;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if the user is authorized to reply to the question
    if (question.learner.equals(userId) || question.mentor.equals(userId)) {
      const replyObject = {
        user: userId,
        message: reply,
      };

      question.replies.push(replyObject);
      await question.save();

      return res.status(200).json({ message: 'Reply added successfully', question });
    }

    // If the user is not authorized, return a 403 Forbidden status code
    res.status(403).json({ message: 'You are not authorized to reply to this question' });
  } catch (error) {
    console.error('Error replying to question:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.deleteReply = async (req, res) => {
  const userId = req.user._id;
  const { questionId, replyId } = req.params;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Find the index of the reply in the replies array
    const replyIndex = question.replies.findIndex(r => r._id.toString() === replyId);
    if (replyIndex === -1) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    const reply = question.replies[replyIndex];

    // Check if the user is authorized to delete the reply
    if (reply.user.toString() === userId) {
      // Remove the reply from the array
      question.replies.splice(replyIndex, 1);
      await question.save();

      return res.status(200).json({ message: 'Reply deleted successfully', question });
    }

    // If the user is not authorized, return a 403 Forbidden status code
    res.status(403).json({ message: 'You are not authorized to delete this reply' });
  } catch (error) {
    console.error('Error deleting reply:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
