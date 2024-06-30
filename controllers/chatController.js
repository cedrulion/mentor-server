const Chat = require('../models/Chat');

// Client sends a message
exports.createMessage = async (req, res) => {
  const clientId = req.user._id;
  const { mentorId, message } = req.body;

  try {
    const chat = await Chat.findOneAndUpdate(
      { mentor: mentorId, client: clientId },
      {
        $push: {
          messages: {
            sender: clientId,
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

// Mentor replies to a message
exports.replyMessage = async (req, res) => {
  const mentorId = req.user._id;
  const { clientId, message } = req.body;

  try {
    const chat = await Chat.findOneAndUpdate(
      { mentor: mentorId, client: clientId },
      {
        $push: {
          messages: {
            sender: mentorId,
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
  const mentorId = req.params.mentorId;
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
exports.getChats = async (req, res) => {
  const clientId = req.params.clientId;
  const mentorId = req.user._id;

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

exports.getChatsForMentor = async (req, res) => {
  const mentorId = req.user._id;

  try {
    const chats = await Chat.find({ mentor: mentorId })
      .populate('client', 'firstName lastName')
      .exec();

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error getting chats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getChatsForClient = async (req, res) => {
  const clientId = req.user._id;

  try {
    const chats = await Chat.find({ client: clientId })
      .populate('mentor', 'firstName lastName')
      .exec();

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error getting chats:', error);
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
