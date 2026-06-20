import * as service from "../service/notification.service.js";

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const getNotifications = asyncHandler(async (req, res) => {
  const result = await service.getNotifications(req.user.id);
  res.json(result);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const result = await service.markAsRead(req.params.id, req.user.id);
  res.json(result);
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await service.markAllAsRead(req.user.id);
  res.json(result);
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const result = await service.deleteNotification(req.params.id, req.user.id);
  res.json(result);
});
