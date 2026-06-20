import { Router } from "express";
import * as controller from "../controller/grade.controller.js";
import { authenticate } from "../../../shared/middleware/auth.middleware.js";
import { authorizePermission } from "../../../shared/middleware/permission.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Grades
 *   description: Student performance grading
 */

/**
 * @swagger
 * /grades:
 *   post:
 *     summary: Grade a student submission (Teacher only)
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [submission_id, score]
 *             properties:
 *               submission_id:
 *                 type: integer
 *               score:
 *                 type: number
 *               feedback:
 *                 type: string
 *     responses:
 *       201:
 *         description: Grade submitted successfully
 */
router.post("/", authenticate, authorizePermission("grade.create"), controller.createGrade);

/**
 * @swagger
 * /grades/{submissionId}:
 *   get:
 *     summary: Get grade for a submission
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Grade details
 */
router.get("/:submissionId", authenticate, controller.getGrade);

export default router;
