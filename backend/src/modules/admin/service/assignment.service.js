import * as repo from "../repository/assignment.repository.js";

export const getAllAssignments = async () => {
    return await repo.findAllAssignments();
};
