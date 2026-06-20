import db from "../../../database/index.js";
import { Op } from "sequelize";

export const createMessage = async (data) => {
  const { sender_id, receiver_id, content, media_url, media_type, reply_to_id } = data;
  const message = await db.models.messages.create({
    sender_id, receiver_id, message: content || '', media_url: media_url || null, media_type: media_type || null, reply_to_id: reply_to_id || null
  });
  return message.id;
};

export const findMessagesBetweenUsers = async (userId1, userId2) => {
  const messages = await db.models.messages.findAll({
    where: {
      [Op.or]: [
        { sender_id: userId1, receiver_id: userId2 },
        { sender_id: userId2, receiver_id: userId1 }
      ]
    },
    include: [
      { model: db.models.users, as: 'sender', attributes: ['username'] },
      { model: db.models.users, as: 'receiver', attributes: ['username'] },
      { 
        model: db.models.messages, 
        as: 'reply_to', 
        include: [{ model: db.models.users, as: 'sender', attributes: ['username'] }] 
      }
    ],
    order: [['created_at', 'ASC']]
  });
  return messages.map(m => {
    const data = m.toJSON();
    return {
      id: data.id,
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
      content: data.message,
      media_url: data.media_url,
      media_type: data.media_type,
      reply_to_id: data.reply_to_id,
      is_read: data.is_read,
      created_at: data.created_at,
      sender_name: data.sender?.username,
      receiver_name: data.receiver?.username,
      reply_content: data.reply_to?.message,
      reply_media_url: data.reply_to?.media_url,
      reply_media_type: data.reply_to?.media_type,
      reply_sender_name: data.reply_to?.sender?.username
    };
  });
};

export const findRecentConversations = async (userId) => {
  const rows = await db.sequelize.query(
    `SELECT 
       CASE 
         WHEN sender_id = :userId THEN receiver_id 
         ELSE sender_id 
       END AS contact_id, 
       MAX(created_at) as last_message_at
     FROM messages
     WHERE sender_id = :userId OR receiver_id = :userId
     GROUP BY contact_id
     ORDER BY last_message_at DESC`,
    { replacements: { userId }, type: db.Sequelize.QueryTypes.SELECT }
  );
  return rows;
};

export const markMessagesAsRead = async (senderId, receiverId) => {
  await db.models.messages.update(
    { is_read: true },
    {
      where: {
        sender_id: senderId,
        receiver_id: receiverId,
        is_read: false
      }
    }
  );
};

export const createAnnouncement = async (data) => {
  const { admin_id, title, content } = data;
  const [result] = await db.sequelize.query(
    `INSERT INTO announcements (admin_id, title, content)
     VALUES (?, ?, ?)`,
    { replacements: [admin_id, title, content], type: db.Sequelize.QueryTypes.INSERT }
  );
  return result[0];
};

export const findAllAnnouncements = async () => {
  const rows = await db.sequelize.query(
    `SELECT a.*, u.username as admin_name 
     FROM announcements a
     JOIN users u ON a.admin_id = u.id
     ORDER BY a.created_at DESC`,
    { type: db.Sequelize.QueryTypes.SELECT }
  );
  return rows;
};
