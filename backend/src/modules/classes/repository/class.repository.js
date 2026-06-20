import db from "../../../database/index.js";
import { Op } from "sequelize";

export const createClass = async ({ teacher_id, name, code, description, cover_image }) => {
  const newClass = await db.models.classes.create({
    teacher_id, name, code, description, cover_image
  });
  return newClass.id;
};

export const findAll = async () => {
  const classes = await db.models.classes.findAll({
    include: [{ model: db.models.users, as: 'teacher', attributes: ['username'] }]
  });
  return classes.map(c => {
    const data = c.toJSON();
    return { ...data, teacher_name: data.teacher?.username };
  });
};

export const findById = async (id) => {
  const classItem = await db.models.classes.findByPk(id, {
    include: [{ model: db.models.users, as: 'teacher', attributes: ['username'] }]
  });
  if (!classItem) return null;
  const data = classItem.toJSON();
  return { ...data, teacher_name: data.teacher?.username };
};

export const findEnrolledStudents = async (classId) => {
  const enrollments = await db.models.enrollments.findAll({
    where: { class_id: classId },
    include: [{
      model: db.models.users,
      as: 'student',
      attributes: ['id', 'username', 'email'],
      include: [{ model: db.models.user_profiles, as: 'user_profile', attributes: ['first_name', 'last_name'] }]
    }]
  });
  return enrollments.map(e => {
    const data = e.toJSON();
    return {
      id: data.student.id,
      username: data.student.username,
      email: data.student.email,
      first_name: data.student.user_profile?.first_name,
      last_name: data.student.user_profile?.last_name,
      enrolled_at: data.enrolled_at,
      status: data.status
    };
  });
};

export const deleteClass = async (id) => {
  await db.models.classes.destroy({ where: { id } });
};

export const findByCode = async (code) => {
  return await db.models.classes.findOne({ where: { code }, raw: true });
};

export const checkEnrollment = async (classId, studentId) => {
  const count = await db.models.enrollments.count({
    where: { class_id: classId, student_id: studentId }
  });
  return count > 0;
};

export const enrollStudent = async (classId, studentId) => {
  await db.models.enrollments.create({ class_id: classId, student_id: studentId });
};

export const removeStudent = async (classId, studentId) => {
  await db.models.enrollments.destroy({
    where: { class_id: classId, student_id: studentId }
  });
};

export const updateClass = async (id, data) => {
  await db.models.classes.update(data, { where: { id } });
};

export const findByTeacher = async (teacherId) => {
  const classes = await db.models.classes.findAll({
    where: { teacher_id: teacherId },
    attributes: {
      include: [
        [
          db.sequelize.literal(`(SELECT COUNT(*) FROM enrollments e WHERE e.class_id = classes.id AND e.status = 'active')`),
          'student_count'
        ]
      ]
    }
  });
  return classes.map(c => c.toJSON());
};

export const findByStudent = async (studentId) => {
  const enrollments = await db.models.enrollments.findAll({
    where: { student_id: studentId, status: 'active' },
    include: [{
      model: db.models.classes,
      as: 'class',
      include: [{ model: db.models.users, as: 'teacher', attributes: ['username'] }],
      attributes: {
        include: [
          [
            db.sequelize.literal(`(SELECT COUNT(*) FROM assignments a WHERE a.class_id = class.id)`),
            'total_assignments'
          ],
          [
            db.sequelize.literal(`(SELECT COUNT(*) FROM submissions s JOIN assignments a ON s.assignment_id = a.id WHERE a.class_id = class.id AND s.student_id = ${db.sequelize.escape(studentId)})`),
            'completed_assignments'
          ],
          [
            db.sequelize.literal(`(SELECT SUM(g.score) FROM grades g JOIN submissions s ON g.submission_id = s.id JOIN assignments a ON s.assignment_id = a.id WHERE a.class_id = class.id AND s.student_id = ${db.sequelize.escape(studentId)})`),
            'total_earned_score'
          ],
          [
            db.sequelize.literal(`(SELECT SUM(a.max_score) FROM grades g JOIN submissions s ON g.submission_id = s.id JOIN assignments a ON s.assignment_id = a.id WHERE a.class_id = class.id AND s.student_id = ${db.sequelize.escape(studentId)})`),
            'total_max_score'
          ]
        ]
      }
    }]
  });
  return enrollments.map(e => {
    const data = e.toJSON().class;
    return { ...data, teacher_name: data.teacher?.username };
  });
};

export const findStudentsByTeacher = async (teacherId) => {
  const enrollments = await db.models.enrollments.findAll({
    where: { status: 'active' },
    include: [
      {
        model: db.models.classes,
        as: 'class',
        where: { teacher_id: teacherId },
        attributes: []
      },
      {
        model: db.models.users,
        as: 'student',
        attributes: ['id', 'username', 'email'],
        include: [{ model: db.models.user_profiles, as: 'user_profile', attributes: ['first_name', 'last_name'] }]
      }
    ]
  });
  
  const studentMap = new Map();
  for (const e of enrollments) {
    const data = e.toJSON().student;
    if (!studentMap.has(data.id)) {
      studentMap.set(data.id, {
        id: data.id,
        username: data.username,
        email: data.email,
        first_name: data.user_profile?.first_name,
        last_name: data.user_profile?.last_name
      });
    }
  }
  return Array.from(studentMap.values());
};