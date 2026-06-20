import db from "../../../database/index.js";

export const findAllClasses = async () => {
    const classes = await db.models.classes.findAll({
        include: [{ model: db.models.users, as: 'teacher', attributes: ['username'] }],
        attributes: {
            include: [
                [db.sequelize.literal(`(SELECT COUNT(*) FROM enrollments e WHERE e.class_id = classes.id)`), 'student_count']
            ]
        }
    });
    return classes.map(c => {
        const data = c.toJSON();
        return { ...data, teacher_name: data.teacher?.username };
    });
};

export const findClassDetails = async (id) => {
    const classItem = await db.models.classes.findByPk(id, {
        include: [
            { model: db.models.users, as: 'teacher', attributes: ['username', 'email'] },
            { 
                model: db.models.enrollments, 
                as: 'enrollments', 
                include: [{ model: db.models.users, as: 'student', attributes: ['id', 'username', 'email'] }] 
            }
        ]
    });
    
    if (!classItem) return null;
    const data = classItem.toJSON();
    
    return {
        ...data,
        teacher_name: data.teacher?.username,
        teacher_email: data.teacher?.email,
        students: (data.enrollments || []).map(e => ({
            id: e.student?.id,
            username: e.student?.username,
            email: e.student?.email,
            enrolled_at: e.enrolled_at
        }))
    };
};

export const deleteClass = async (id) => {
    await db.models.classes.destroy({ where: { id } });
};
