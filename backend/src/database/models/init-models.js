import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _activity_logs from  "./activity_logs.js";
import _assignments from  "./assignments.js";
import _classes from  "./classes.js";
import _enrollments from  "./enrollments.js";
import _goals from  "./goals.js";
import _grades from  "./grades.js";
import _materials from  "./materials.js";
import _messages from  "./messages.js";
import _notifications from  "./notifications.js";
import _permissions from  "./permissions.js";
import _refresh_tokens from  "./refresh_tokens.js";
import _role_permissions from  "./role_permissions.js";
import _roles from  "./roles.js";
import _submissions from  "./submissions.js";
import _system_logs from  "./system_logs.js";
import _teacher_requests from  "./teacher_requests.js";
import _user_profiles from  "./user_profiles.js";
import _users from  "./users.js";

export default function initModels(sequelize) {
  const activity_logs = _activity_logs.init(sequelize, DataTypes);
  const assignments = _assignments.init(sequelize, DataTypes);
  const classes = _classes.init(sequelize, DataTypes);
  const enrollments = _enrollments.init(sequelize, DataTypes);
  const goals = _goals.init(sequelize, DataTypes);
  const grades = _grades.init(sequelize, DataTypes);
  const materials = _materials.init(sequelize, DataTypes);
  const messages = _messages.init(sequelize, DataTypes);
  const notifications = _notifications.init(sequelize, DataTypes);
  const permissions = _permissions.init(sequelize, DataTypes);
  const refresh_tokens = _refresh_tokens.init(sequelize, DataTypes);
  const role_permissions = _role_permissions.init(sequelize, DataTypes);
  const roles = _roles.init(sequelize, DataTypes);
  const submissions = _submissions.init(sequelize, DataTypes);
  const system_logs = _system_logs.init(sequelize, DataTypes);
  const teacher_requests = _teacher_requests.init(sequelize, DataTypes);
  const user_profiles = _user_profiles.init(sequelize, DataTypes);
  const users = _users.init(sequelize, DataTypes);

  permissions.belongsToMany(roles, { as: 'role_id_roles', through: role_permissions, foreignKey: "permission_id", otherKey: "role_id" });
  roles.belongsToMany(permissions, { as: 'permission_id_permissions', through: role_permissions, foreignKey: "role_id", otherKey: "permission_id" });
  goals.belongsTo(assignments, { as: "assignment", foreignKey: "assignment_id"});
  assignments.hasMany(goals, { as: "goals", foreignKey: "assignment_id"});
  submissions.belongsTo(assignments, { as: "assignment", foreignKey: "assignment_id"});
  assignments.hasMany(submissions, { as: "submissions", foreignKey: "assignment_id"});
  assignments.belongsTo(classes, { as: "class", foreignKey: "class_id"});
  classes.hasMany(assignments, { as: "assignments", foreignKey: "class_id"});
  enrollments.belongsTo(classes, { as: "class", foreignKey: "class_id"});
  classes.hasMany(enrollments, { as: "enrollments", foreignKey: "class_id"});
  goals.belongsTo(classes, { as: "class", foreignKey: "class_id"});
  classes.hasMany(goals, { as: "goals", foreignKey: "class_id"});
  materials.belongsTo(classes, { as: "class", foreignKey: "class_id"});
  classes.hasMany(materials, { as: "materials", foreignKey: "class_id"});
  messages.belongsTo(messages, { as: "reply_to", foreignKey: "reply_to_id"});
  messages.hasMany(messages, { as: "messages", foreignKey: "reply_to_id"});
  role_permissions.belongsTo(permissions, { as: "permission", foreignKey: "permission_id"});
  permissions.hasMany(role_permissions, { as: "role_permissions", foreignKey: "permission_id"});
  role_permissions.belongsTo(roles, { as: "role", foreignKey: "role_id"});
  roles.hasMany(role_permissions, { as: "role_permissions", foreignKey: "role_id"});
  users.belongsTo(roles, { as: "role", foreignKey: "role_id"});
  roles.hasMany(users, { as: "users", foreignKey: "role_id"});
  grades.belongsTo(submissions, { as: "submission", foreignKey: "submission_id"});
  submissions.hasOne(grades, { as: "grade", foreignKey: "submission_id"});
  activity_logs.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(activity_logs, { as: "activity_logs", foreignKey: "user_id"});
  classes.belongsTo(users, { as: "teacher", foreignKey: "teacher_id"});
  users.hasMany(classes, { as: "classes", foreignKey: "teacher_id"});
  enrollments.belongsTo(users, { as: "student", foreignKey: "student_id"});
  users.hasMany(enrollments, { as: "enrollments", foreignKey: "student_id"});
  goals.belongsTo(users, { as: "student", foreignKey: "student_id"});
  users.hasMany(goals, { as: "goals", foreignKey: "student_id"});
  messages.belongsTo(users, { as: "sender", foreignKey: "sender_id"});
  users.hasMany(messages, { as: "messages", foreignKey: "sender_id"});
  messages.belongsTo(users, { as: "receiver", foreignKey: "receiver_id"});
  users.hasMany(messages, { as: "receiver_messages", foreignKey: "receiver_id"});
  notifications.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(notifications, { as: "notifications", foreignKey: "user_id"});
  refresh_tokens.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(refresh_tokens, { as: "refresh_tokens", foreignKey: "user_id"});
  submissions.belongsTo(users, { as: "student", foreignKey: "student_id"});
  users.hasMany(submissions, { as: "submissions", foreignKey: "student_id"});
  system_logs.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(system_logs, { as: "system_logs", foreignKey: "user_id"});
  teacher_requests.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(teacher_requests, { as: "teacher_requests", foreignKey: "user_id"});
  teacher_requests.belongsTo(users, { as: "reviewed_by_user", foreignKey: "reviewed_by"});
  users.hasMany(teacher_requests, { as: "reviewed_by_teacher_requests", foreignKey: "reviewed_by"});
  user_profiles.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasOne(user_profiles, { as: "user_profile", foreignKey: "user_id"});

  return {
    activity_logs,
    assignments,
    classes,
    enrollments,
    goals,
    grades,
    materials,
    messages,
    notifications,
    permissions,
    refresh_tokens,
    role_permissions,
    roles,
    submissions,
    system_logs,
    teacher_requests,
    user_profiles,
    users,
  };
}
