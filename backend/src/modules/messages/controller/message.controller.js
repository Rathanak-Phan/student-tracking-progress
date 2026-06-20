import * as service from "../service/message.service.js";
import { logActivity } from "../../logs/service/log.service.js";
import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { getIO } from "../../../app/socket.js";

export const sendMessage = asyncHandler(async (req, res) => {
  let mediaUrl = null;
  let mediaType = null;

  if (req.file) {
    mediaUrl = `/uploads/messages/${req.file.filename}`;
    mediaType = req.file.mimetype;
  }

  const data = {
    ...req.body,
    sender_id: req.user.id,
    media_url: mediaUrl,
    media_type: mediaType,
    reply_to_id: req.body.reply_to_id || null
  };
  const result = await service.sendMessage(data);
  await logActivity(req.user.id, `Sent a message to user ID: ${req.body.receiver_id}`);

  // Emit real-time notification
  try {
    const io = getIO();
    io.to(req.body.receiver_id.toString()).emit("new_message", {
      id: result.messageId,
      sender_id: req.user.id,
      receiver_id: req.body.receiver_id,
      content: req.body.content || '',
      media_url: mediaUrl,
      media_type: mediaType,
      reply_to_id: req.body.reply_to_id || null,
      created_at: new Date().toISOString(),
      sender_name: req.user.username // If we had username in token, else frontend handles it
    });
  } catch (err) {
    console.error("Socket emit failed", err);
  }

  res.status(201).json(result);
});

export const getConversation = asyncHandler(async (req, res) => {
  const result = await service.getMessagesBetweenUsers(req.user.id, req.params.userId);
  res.json(result);
});

export const getRecentConversations = asyncHandler(async (req, res) => {
  const result = await service.getRecentConversations(req.user.id);
  res.json(result);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const senderId = req.params.senderId;
  const receiverId = req.user.id;
  
  const result = await service.markAsRead(senderId, receiverId);
  res.json(result);
});

export const createAnnouncement = asyncHandler(async (req, res) => {
  const result = await service.createAnnouncement({
    ...req.body,
    admin_id: req.user.id
  });
  await logActivity(req.user.id, `Created an announcement: ${req.body.title}`);
  res.status(201).json(result);
});

export const getAnnouncements = asyncHandler(async (req, res) => {
  const result = await service.getAnnouncements();
  res.json(result);
});
