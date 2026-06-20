import { Router } from "express";
import * as userController from "../controller/index.js";

import { authenticate } from "../../../shared/middleware/auth.middleware.js";
import upload from "../../../shared/middleware/upload.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authenticate, userController.getMe);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put("/profile", authenticate, userController.updateProfile);

/**
 * @swagger
 * /users/avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *       400:
 *         description: Invalid file
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/avatar",
    authenticate,
    upload.single("avatar"),
    userController.uploadAvatar
);

/**
 * @swagger
 * /users/academic-record:
 *   get:
 *     summary: Get my complete academic record (Student only)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student academic record (grades and goals)
 */
router.get("/academic-record", authenticate, userController.getAcademicRecord);

/**
 * @swagger
 * /users/request-teacher:
 *   post:
 *     summary: Request to become a teacher
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teacher role requested successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/request-teacher", authenticate, userController.requestTeacher);

export default router;