import * as repo from "../repository/notification.repository.js";
import { getIO } from "../../../app/socket.js";

export const getNotifications = async (userId) => {
  return await repo.findByUserId(userId);
};

export const markAsRead = async (id, userId) => {
  await repo.markAsRead(id, userId);
  return { message: "Notification marked as read" };
};

export const markAllAsRead = async (userId) => {
  await repo.markAllAsRead(userId);
  return { message: "All notifications marked as read" };
};

export const deleteNotification = async (id, userId) => {
  await repo.deleteNotification(id, userId);
  return { message: "Notification deleted" };
};

export const addNotification = async (userId, data) => {
  const notificationId = await repo.createNotification(userId, data);
  try {
    const io = getIO();
    io.to(userId.toString()).emit("new_notification", {
      id: notificationId,
      ...data,
      is_read: false,
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.error("Socket notification failed:", err.message);
  }
  return notificationId;
};
