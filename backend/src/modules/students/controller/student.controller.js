import * as service from "../service/student.service.js";

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export const getMyStudents = asyncHandler(async (req, res) => {
    const students = await service.getMyStudents(req.user.id);
    res.json(students);
});

export const getStudentProfile = asyncHandler(async (req, res) => {
    const profile = await service.getStudentProfile(req.params.id, req.user.id);
    res.json(profile);
});
