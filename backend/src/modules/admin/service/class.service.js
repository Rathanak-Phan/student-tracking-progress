import * as repo from "../repository/class.repository.js";

export const getAllClasses = async () => {
    return await repo.findAllClasses();
};

export const getClassDetails = async (id) => {
    const classData = await repo.findClassDetails(id);
    if (!classData) throw new Error("Class not found");
    return classData;
};

export const deleteClass = async (id) => {
    await repo.deleteClass(id);
    return { message: "Class deleted successfully" };
};
