import db from "../../../database/index.js";

export const getSystemStats = async () => {
    const totalUsers = await db.models.users.count({ where: { is_deleted: false } });
    
    const totalStudents = await db.models.users.count({
        where: { is_deleted: false },
        include: [{ model: db.models.roles, as: 'role', where: { name: 'student' } }]
    });

    const totalTeachers = await db.models.users.count({
        where: { is_deleted: false },
        include: [{ model: db.models.roles, as: 'role', where: { name: 'teacher' } }]
    });

    const totalClasses = await db.models.classes.count();
    const totalAssignments = await db.models.assignments.count();
    const totalSubmissions = await db.models.submissions.count();
    
    // Calculate global submission rate
    const expectedSubmissions = await db.models.enrollments.count({
        where: { status: 'active' },
        include: [{
            model: db.models.classes,
            as: 'class',
            required: true,
            include: [{
                model: db.models.assignments,
                as: 'assignments',
                required: true
            }]
        }]
    });
    
    const submissionsCount = totalSubmissions;
    const expectedCount = expectedSubmissions;
    const globalSubmissionRate = expectedCount > 0 ? Math.round((submissionsCount / expectedCount) * 100) : 0;

    return {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalClasses,
        totalAssignments,
        totalSubmissions: submissionsCount,
        globalSubmissionRate
    };
};
