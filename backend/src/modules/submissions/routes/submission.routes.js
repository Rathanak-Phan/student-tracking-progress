import { Router } from "express";
import * as controller from "../controller/submission.controller.js";
import { authenticate } from "../../../shared/middleware/auth.middleware.js";
import { authorizePermission } from "../../../shared/middleware/permission.middleware.js";
import { submissionUpload } from "../../../shared/middleware/upload.middleware.js";
import { validateRequest } from "../../../shared/middleware/validate.middleware.js";
import { submissionSchema } from "../validation/submission.validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Submissions
 *   description: Assignment submissions
 */

/**
 * @swagger
 * /submissions:
 *   post:
 *     summary: Submit an assignment (Student only)
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [assignment_id, file]
 *             properties:
 *               assignment_id:
 *                 type: integer
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Assignment submitted
 */
router.post("/", authenticate, authorizePermission("assignment.submit"), submissionUpload.single("file"), controller.submitAssignment);

/**
 * @swagger
 * /submissions:
 *   get:
 *     summary: Get submissions for an assignment (Teacher only)
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: assignment_id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: List of submissions
 */
router.get("/", authenticate, authorizePermission("submission.view"), controller.getSubmissions);

/**
 * @swagger
 * /submissions/me:
 *   get:
 *     summary: Get my submissions (Student only)
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of my submissions
 */
router.get("/me", authenticate, authorizePermission("submission.view"), controller.getMySubmissions);

export default router;
