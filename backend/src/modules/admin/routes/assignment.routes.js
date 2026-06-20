import { Router } from "express";
import * as controller from "../controller/assignment.controller.js";

const router = Router();

/**
 * @swagger
 * /admin/assignments:
 *   get:
 *     summary: Get all assignments (Admin only)
 *     tags: [Admin - Assignments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all assignments
 */
router.get("/", controller.getAllAssignments);

export default router;
