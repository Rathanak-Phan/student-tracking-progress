import { Router } from "express";
import * as controller from "../controller/notification.controller.js";
import { authenticate } from "../../../shared/middleware/auth.middleware.js";

const router = Router();

// Secure all notification endpoints with user authentication
router.use(authenticate);

router.get("/", controller.getNotifications);
router.put("/read-all", controller.markAllAsRead);
router.put("/:id/read", controller.markAsRead);
router.delete("/:id", controller.deleteNotification);

export default router;
