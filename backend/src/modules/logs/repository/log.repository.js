import db from "../../../database/index.js";

export const createLog = async (userId, action) => {
  await db.models.activity_logs.create({
    user_id: userId, action
  });
};
