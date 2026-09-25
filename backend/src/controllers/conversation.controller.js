import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getIO } from '../sockets/index.js';


// GET /api/v1/conversations — every conversation the logged-in user is part of
export const listConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate('participants', 'name avatar')
    .populate('lastMessage')
    .sort('-updatedAt');


  sendSuccess(res, 200, conversations);
});


// POST /api/v1/conversations — start a 1-on-1 conversation, or return the
// existing one if it already exists (never create duplicates for the same pair)
export const startConversation = asyncHandler(async (req, res) => {
  const { participantId } = req.body;


  if (participantId === req.user._id.toString()) {
    throw ApiError.badRequest('You cannot message yourself');
  }


  let conversation = await Conversation.findOne({
    isGroup: false,
    participants: { $all: [req.user._id, participantId], $size: 2 },
  });


  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, participantId],
      isGroup: false,
    });
  }


  await conversation.populate('participants', 'name avatar');
  sendSuccess(res, 201, conversation);
});


function assertParticipant(conversation, userId) {
  const isParticipant = conversation.participants.some((p) => p.toString() === userId.toString());
  if (!isParticipant) throw ApiError.forbidden('You are not part of this conversation');
}


// GET /api/v1/conversations/:id/messages
export const listMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) throw ApiError.notFound('Conversation not found');
  assertParticipant(conversation, req.user._id);


  const messages = await Message.find({ conversation: conversation._id })
    .populate('sender', 'name avatar')
    .sort('createdAt');


  // Mark every message not sent by me as read by me
  await Message.updateMany(
    { conversation: conversation._id, sender: { $ne: req.user._id } },
    { $addToSet: { readBy: req.user._id } }
  );


  sendSuccess(res, 200, messages);
});


// POST /api/v1/conversations/:id/messages
export const sendMessage = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) throw ApiError.notFound('Conversation not found');
  assertParticipant(conversation, req.user._id);


  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    body: req.body.body,
    readBy: [req.user._id],
  });
  await message.populate('sender', 'name avatar');


  conversation.lastMessage = message._id;
  await conversation.save(); // also bumps updatedAt, keeping the conversation list sorted correctly


  // Push it live to everyone in this conversation (including the sender,
  // so their other open tabs/devices stay in sync too).
  const io = getIO();
  conversation.participants.forEach((participantId) => {
    io.to(`user:${participantId}`).emit('message:new', {
      conversationId: conversation._id,
      message,
    });
  });


  sendSuccess(res, 201, message);
});

// DELETE /api/v1/conversations/:id/messages — wipes all messages in this
// conversation. The conversation itself stays (so you can keep chatting),
// only its message history is cleared.
export const clearConversationMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) throw ApiError.notFound('Conversation not found');
  assertParticipant(conversation, req.user._id);


  await Message.deleteMany({ conversation: conversation._id });


  conversation.lastMessage = undefined;
  await conversation.save();


  sendSuccess(res, 200, { cleared: true });
});


