import db from "../../../database/index.js";

export const findByEmail = async (email) => {
  return await db.models.users.findOne({ where: { email }, raw: true });
};

export const findByUsername = async (username) => {
  return await db.models.users.findOne({ where: { username }, raw: true });
};

export const existsByEmail = async (email) => {
  const count = await db.models.users.count({ where: { email } });
  return count > 0;
};

export const existsByUsername = async (username) => {
  const count = await db.models.users.count({ where: { username } });
  return count > 0;
};

export const create = async (userData) => {
  // map generic user fields to DB fields if necessary
  const { id, username, email, password, role_id } = userData;
  const user = await db.models.users.create({
    id, username, email, password_hash: password, role_id
  });
  return user.toJSON();
};

export const findAndCountAll = async ({ limit, offset }) => {
  const { count, rows } = await db.models.users.findAndCountAll({
    limit,
    offset,
    attributes: ['id', 'username', 'email', 'role_id', 'created_at', 'updated_at'],
    raw: true
  });
  return { rows, count };
};
