import * as service from "../service/teacher.service.js";

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export const getPendingTeachers = asyncHandler(async (req, res) => {
    const result = await service.getPendingTeachers();
    res.json(result);
});

export const approveTeacher = asyncHandler(async (req, res) => {
    const result = await service.validateTeacher(req.params.id, true);
    res.json(result);
});

export const rejectTeacher = asyncHandler(async (req, res) => {
    const result = await service.validateTeacher(req.params.id, false);
    res.json(result);
});
