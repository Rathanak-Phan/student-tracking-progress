import bcrypt from "bcrypt";

export const createUserWithRole = async (connection, user, roleName) => {
  // 1. Get role ID first
  const [roles] = await connection.query(
    `SELECT id FROM roles WHERE name = ?`,
    [roleName],
  );

  if (!roles.length) {
    throw new Error(`Role '${roleName}' not found`);
  }
  const roleId = roles[0].id;

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(user.password, 10);

  // 3. Insert user with role_id (mandatory)
  const [userResult] = await connection.query(
    `INSERT INTO users (username, email, password_hash, role_id, is_validated)
     VALUES (?, ?, ?, ?, ?)`,
    [user.username, user.email, hashedPassword, roleId, true],
  );

  const userId = userResult.insertId;

  // 4. Create user profile
  await connection.query(
    `INSERT INTO user_profiles (user_id, first_name, last_name)
    VALUES (?, ?, ?)`,
    [userId, user.first_name, user.last_name],
  );

  return userId;
};
