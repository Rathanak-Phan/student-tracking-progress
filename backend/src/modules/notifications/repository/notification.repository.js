import db from "../../../database/index.js";

export const createNotification = async (userId, { title, message, type, link = null }) => {
  const notif = await db.models.notifications.create({
    user_id: userId, title, message, type, link
  });
  return notif.id;
};

export const findByUserId = async (userId) => {
  return await db.models.notifications.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    limit: 50,
    raw: true
  });
};

export const markAsRead = async (id, userId) => {
  await db.models.notifications.update(
    { is_read: true },
    { where: { id, user_id: userId } }
  );
};

export const markAllAsRead = async (userId) => {
  await db.models.notifications.update(
    { is_read: true },
    { where: { user_id: userId } }
  );
};

export const deleteNotification = async (id, userId) => {
  await db.models.notifications.destroy({
    where: { id, user_id: userId }
  });
};
