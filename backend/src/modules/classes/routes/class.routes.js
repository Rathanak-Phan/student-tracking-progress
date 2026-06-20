import express from "express";
import * as controller from "../controller/class.controller.js";
import { authenticate } from "../../../shared/middleware/auth.middleware.js";
import { authorizePermission } from "../../../shared/middleware/permission.middleware.js";
import { validateRequest } from "../../../shared/middleware/validate.middleware.js";
import { classCoverUpload } from "../../../shared/middleware/upload.middleware.js";
import * as schema from "../validation/class.validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Classes
 */

/**
 * @swagger
 * /classes:
 *   post:
 *     summary: Create class (Teacher only)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authenticate, authorizePermission("class.create"), classCoverUpload.single("cover_image"), validateRequest(schema.createClassSchema), controller.createClass);

/**
 * @swagger
 * /classes/join:
 *   post:
 *     summary: Join class by code (Student only)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code]
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Joined class successfully
 */
router.post("/join", authenticate, authorizePermission("class.join"), validateRequest(schema.joinClassSchema), controller.joinClass);

/**
 * @swagger
 * /classes:
 *   get:
 *     summary: Get all classes
 *     tags: [Classes]
 */
router.get("/", authenticate, controller.getAllClasses);

/**
 * @swagger
 * /classes/{id}:
 *   get:
 *     summary: Get class by ID
 */
router.get("/:id", controller.getClassById);

/**
 * @swagger
 * /classes/{id}:
 *   delete:
 *     summary: Delete class
 */
router.delete(
  "/:id",
  authenticate,
  authorizePermission("class.delete"),
  controller.deleteClass
);

/**
 * @swagger
 * /classes/{id}/enrollments/{studentId}:
 *   delete:
 *     summary: Remove a student from class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student removed successfully
 */
router.delete(
  "/:id/enrollments/:studentId",
  authenticate,
  controller.removeStudent
);

/**
 * @swagger
 * /classes/{id}:
 *   put:
 *     summary: Update class details (Teacher only)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Class updated successfully
 */
router.put("/:id", authenticate, authorizePermission("class.create"), classCoverUpload.single("cover_image"), validateRequest(schema.updateClassSchema), controller.updateClass);

/**
 * @swagger
 * /classes/{id}/students:
 *   get:
 *     summary: Get students enrolled in a class (Teacher/Admin only)
 *     tags: [Classes]
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
 *         description: List of students
 */
router.get("/:id/students", authenticate, controller.getEnrolledStudents);

/**
 * @swagger
 * /classes/{id}/join-requests:
 *   get:
 *     summary: Get pending join requests for a class (Teacher only)
 *     tags: [Classes]
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
 *         description: List of pending join requests
 */
router.get("/:id/join-requests", authenticate, controller.getPendingJoinRequests);

/**
 * @swagger
 * /classes/{id}/join-requests/{requestId}/approve:
 *   post:
 *     summary: Approve a student join request (Teacher only)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Join request approved
 */
router.post("/:id/join-requests/:requestId/approve", authenticate, controller.approvePendingRequest);

/**
 * @swagger
 * /classes/{id}/join-requests/{requestId}/reject:
 *   post:
 *     summary: Reject a student join request (Teacher only)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Join request rejected
 */
router.post("/:id/join-requests/:requestId/reject", authenticate, controller.rejectPendingRequest);

export default router;