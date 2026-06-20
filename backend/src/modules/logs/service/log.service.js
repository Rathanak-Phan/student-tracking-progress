import * as repo from "../repository/log.repository.js";

export const logActivity = async (userId, action) => {
  try {
    await repo.createLog(userId, action);
  } catch (err) {
    console.error("Activity logging failed:", err.message);
    // Don't throw error to prevent breaking main request flow
  }
};
