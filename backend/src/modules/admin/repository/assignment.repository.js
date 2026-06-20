import db from "../../../database/index.js";

export const findAllAssignments = async () => {
    const assignments = await db.models.assignments.findAll({
        include: [{ model: db.models.classes, as: 'class', attributes: ['name', 'is_active'] }],
        attributes: {
            include: [
                [db.sequelize.literal(`(SELECT COUNT(*) FROM submissions s WHERE s.assignment_id = assignments.id)`), 'submission_count'],
                [db.sequelize.literal(`(SELECT COUNT(*) FROM enrollments e WHERE e.class_id = assignments.class_id AND e.status = 'active')`), 'total_students']
            ]
        },
        order: [['created_at', 'DESC']]
    });
    return assignments.map(a => {
        const data = a.toJSON();
        return {
            ...data,
            class_name: data.class?.name,
            class_is_active: data.class?.is_active
        };
    });
};
