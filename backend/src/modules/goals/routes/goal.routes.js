import { Router } from "express";
import * as controller from "../controller/goal.controller.js";
import { authenticate } from "../../../shared/middleware/auth.middleware.js";
import { authorizeRoles } from "../../../shared/middleware/role.middleware.js";
import { validateRequest } from "../../../shared/middleware/validate.middleware.js";
import { goalSchema, updateGoalSchema } from "../validation/goal.validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Goals
 *   description: Student goal management
 */

/**
 * @swagger
 * /goals:
 *   post:
 *     summary: Set a new goal (Student only)
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, target_date]
 *             properties:
 *               title:
 *                 type: string
 *               target_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Goal created
 */
router.post("/", authenticate, authorizeRoles("student"), validateRequest(goalSchema), controller.createGoal);

/**
 * @swagger
 * /goals:
 *   get:
 *     summary: Get my goals (Student only)
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of goals
 */
router.get("/", authenticate, authorizeRoles("student"), controller.getGoalsByStudent);

/**
 * @swagger
 * /goals/{id}:
 *   get:
 *     summary: Get goal by ID
 *     tags: [Goals]
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
 *         description: Goal details
 */
router.get("/:id", authenticate, authorizeRoles("student"), controller.getGoalById);

/**
 * @swagger
 * /goals/{id}:
 *   put:
 *     summary: Update goal
 *     tags: [Goals]
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
 *               title:
 *                 type: string
 *               target_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *     responses:
 *       200:
 *         description: Goal updated
 */
router.put("/:id", authenticate, authorizeRoles("student"), validateRequest(updateGoalSchema), controller.updateGoal);
router.patch("/:id", authenticate, authorizeRoles("student"), validateRequest(updateGoalSchema), controller.updateGoal);

/**
 * @swagger
 * /goals/{id}/complete:
 *   patch:
 *     summary: Mark goal as complete
 *     tags: [Goals]
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
 *         description: Goal marked as complete
 */
router.patch("/:id/complete", authenticate, authorizeRoles("student"), controller.markGoalComplete);

/**
 * @swagger
 * /goals/{id}:
 *   delete:
 *     summary: Delete a goal
 *     tags: [Goals]
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
 *         description: Goal deleted
 */
router.delete("/:id", authenticate, authorizeRoles("student"), controller.deleteGoal);

export default router;
