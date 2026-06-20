/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Central management for platform administrators
 */

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get system-wide statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users with filtering and pagination
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /admin/users/{id}:
 *   put:
 *     summary: Update user (role, validation, active status)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Soft delete user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /admin/teachers/pending:
 *   get:
 *     summary: Get unvalidated teachers
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /admin/teachers/{id}/approve:
 *   put:
 *     summary: Approve a teacher
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /admin/teachers/{id}/reject:
 *   put:
 *     summary: Reject a teacher
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /admin/classes:
 *   get:
 *     summary: View all classes
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /admin/classes/{id}:
 *   get:
 *     summary: View class details (students, teacher)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /admin/classes/{id}:
 *   delete:
 *     summary: Delete a class
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /admin/logs:
 *   get:
 *     summary: View system activity logs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
