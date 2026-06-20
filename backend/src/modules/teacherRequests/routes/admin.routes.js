import express from "express";
import * as controller from "../controller/request.controller.js";
import { authenticate } from "../../../shared/middleware/auth.middleware.js";
import { authorizeRoles } from "../../../shared/middleware/role.middleware.js";

const router = express.Router();

router.use(authenticate, authorizeRoles('admin'));

router.get("/", controller.getPendingRequests);
router.get("/:id", controller.getRequestDetails);
router.patch("/:id/approve", controller.approveRequest);
router.patch("/:id/reject", controller.rejectRequest);

export default router;
