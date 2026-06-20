import * as repo from "../repository/dashboard.repository.js";

export const getAdminDashboard = async () => {
    return await repo.getSystemStats();
};
