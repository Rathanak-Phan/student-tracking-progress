import { Router } from "express";
import userRoutes from "./user.routes.js";
import teacherRoutes from "./teacher.routes.js";
import classRoutes from "./class.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import logsRoutes from "./logs.routes.js";
import assignmentRoutes from "./assignment.routes.js";
import adminTeacherRequestRoutes from "../../teacherRequests/routes/admin.routes.js";
import { authenticate } from "../../../shared/middleware/auth.middleware.js";
import { authorizeRoles } from "../../../shared/middleware/role.middleware.js";

const router = Router();

// Only admin can access these routes
router.use(authenticate);
router.use(authorizeRoles('admin'));

router.use("/users", userRoutes);
router.use("/teachers", teacherRoutes);
router.use("/classes", classRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/logs", logsRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/teacher-requests", adminTeacherRequestRoutes);

export default router;
