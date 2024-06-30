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
            sender: req.user._id,
            message: message,
            timestamp: new Date()
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
  const mentorId = req.params.mentorId
  const clientId = req.user._id;

  try {
    const chat = await Chat.findOne({ mentor: mentorId, client: clientId })
      .populate('messages.sender', 'firstName lastName')
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


exports.getAllChatsForClient = async (req, res) => {
  const mentorId = req.params.mentorId
  const clientId = req.user._id;

  try {
    const chat = await Chat.findOne({ mentor: mentorId, client: clientId })
      .populate('messages.sender', 'firstName lastName')
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

exports.deleteMessage = async (req, res) => {
  const { chatId, messageId } = req.body;

  try {
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { messages: { _id: messageId } } },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.status(200).json({ message: 'Message deleted', chat });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
