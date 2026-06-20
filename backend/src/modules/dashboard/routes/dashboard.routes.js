import { Router } from "express";
import * as controller from "../controller/dashboard.controller.js";
import { authenticate } from "../../../shared/middleware/auth.middleware.js";
import { authorizeRoles } from "../../../shared/middleware/role.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Activity overview for Students and Teachers
 */

/**
 * @swagger
 * /dashboard/student:
 *   get:
 *     summary: Get student dashboard overview
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student dashboard data
 */
router.get("/student", authenticate, authorizeRoles("student"), controller.getStudentDashboard);

/**
 * @swagger
 * /dashboard/teacher:
 *   get:
 *     summary: Get teacher dashboard overview
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teacher dashboard data
 */
router.get("/teacher", authenticate, authorizeRoles("teacher"), controller.getTeacherDashboard);
/**
 * @swagger
 * /dashboard/admin:
 *   get:
 *     summary: Get admin dashboard overview
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard data
 */
router.get("/admin", authenticate, authorizeRoles("admin"), controller.getAdminDashboard);

export default router;
