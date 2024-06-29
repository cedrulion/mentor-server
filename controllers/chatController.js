const Chat = require('../models/Chat');

exports.createMessage = async (req, res) => {
   const clientId = req.user._id;
  const { mentorId, message } = req.body;

  try {
    const chat = await Chat.findOneAndUpdate(
      { mentor: mentorId, client: clientId },
      {
        $push: {
          messages: {
            sender: req.user._id, // Assuming authenticated user is sender
            message: message
          }
        }
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Message sent', chat });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getChat = async (req, res) => {
  const { mentorId, clientId } = req.query;

  try {
    const chat = await Chat.findOne({ mentor: mentorId, client: clientId })
      .populate('messages.sender', 'firstName lastName') // Populate sender details
      .exec();

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error('Error getting chat:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
