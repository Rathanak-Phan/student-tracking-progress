import * as repo from "../repository/logs.repository.js";

export const getActivityLogs = async (filters) => {
    return await repo.findActivityLogs(filters);
};
