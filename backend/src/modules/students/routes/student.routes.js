import { Router } from "express";
import * as controller from "../controller/student.controller.js";
import { authenticate } from "../../../shared/middleware/auth.middleware.js";
import { authorizeRoles } from "../../../shared/middleware/role.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Teacher/Admin access to student information
 */

router.use(authenticate);
router.use(authorizeRoles("teacher", "admin"));

/**
 * @swagger
 * /students/my-students:
 *   get:
 *     summary: Get list of students enrolled in teacher's classes
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 */
router.get("/my-students", controller.getMyStudents);

/**
 * @swagger
 * /students/{id}/profile:
 *   get:
 *     summary: Get student profile and academic record
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student profile data
 */
router.get("/:id/profile", controller.getStudentProfile);

export default router;
