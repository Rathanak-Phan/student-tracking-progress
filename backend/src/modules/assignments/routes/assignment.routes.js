import { Router } from "express";
import * as controller from "../controller/assignment.controller.js";
import { authenticate } from "../../../shared/middleware/auth.middleware.js";
import { authorizePermission } from "../../../shared/middleware/permission.middleware.js";
import { validateRequest } from "../../../shared/middleware/validate.middleware.js";
import * as schema from "../validation/assignment.validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: Assignment management and submissions
 */

/**
 * @swagger
 * /assignments:
 *   post:
 *     summary: Create a new assignment (Teacher only)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [class_id, title, due_date]
 *             properties:
 *               class_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date-time
 *               max_score:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Assignment created
 */
router.post("/", authenticate, authorizePermission("assignment.create"), validateRequest(schema.assignmentSchema), controller.createAssignment);

/**
 * @swagger
 * /assignments:
 *   get:
 *     summary: Get assignments (Filter by class_id)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: class_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the class
 *     responses:
 *       200:
 *         description: List of assignments
 */
router.get("/", authenticate, controller.getAssignmentsByClass);

/**
 * @swagger
 * /assignments/me:
 *   get:
 *     summary: Get assignments for the current user (Teacher or Student)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assignments
 */
router.get("/me", authenticate, controller.getMyAssignments);




/**
 * @swagger
 * /assignments/{id}:
 *   get:
 *     summary: Get assignment by ID
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Assignment details
 */
router.get("/:id", authenticate, controller.getAssignmentById);

/**
 * @swagger
 * /assignments/{id}:
 *   put:
 *     summary: Update assignment (Teacher only)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date-time
 *               max_score:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Assignment updated
 */
router.put("/:id", authenticate, authorizePermission("assignment.create"), validateRequest(schema.updateAssignmentSchema), controller.updateAssignment);

/**
 * @swagger
 * /assignments/{id}:
 *   delete:
 *     summary: Delete assignment (Teacher only)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Assignment deleted
 */
router.delete("/:id", authenticate, authorizePermission("assignment.create"), controller.deleteAssignment);



export default router;
