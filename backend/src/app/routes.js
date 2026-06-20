import express from 'express';
import authRoutes from '../modules/auth/routes/auth.routes.js';
import userRoutes from '../modules/users/routes/user.routes.js';
import classRoutes from '../modules/classes/routes/class.routes.js';
import assignmentRoutes from '../modules/assignments/routes/assignment.routes.js';
import submissionRoutes from '../modules/submissions/routes/submission.routes.js';
import gradeRoutes from '../modules/grades/routes/grade.routes.js';
import dashboardRoutes from '../modules/dashboard/routes/dashboard.routes.js';
import materialRoutes from '../modules/materials/routes/material.routes.js';
import goalRoutes from '../modules/goals/routes/goal.routes.js';
import messageRoutes from '../modules/messages/routes/message.routes.js';
import studentRoutes from '../modules/students/routes/student.routes.js';
import adminRoutes from '../modules/admin/index.js';
import notificationRoutes from '../modules/notifications/routes/notification.routes.js';
import teacherRequestRoutes from '../modules/teacherRequests/routes/request.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/classes', classRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/submissions', submissionRoutes);
router.use('/grades', gradeRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/materials', materialRoutes);
router.use('/goals', goalRoutes);
router.use('/messages', messageRoutes);
router.use('/students', studentRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);
router.use('/teacher-requests', teacherRequestRoutes);

export default router;
