import * as service from "../service/dashboard.service.js";

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export const getStudentDashboard = asyncHandler(async (req, res) => {
    const result = await service.getStudentDashboard(req.user.id);
    res.json(result);
});

export const getTeacherDashboard = asyncHandler(async (req, res) => {
    const result = await service.getTeacherDashboard(req.user.id);
    res.json(result);
});

export const getAdminDashboard = asyncHandler(async (req, res) => {
    const result = await service.getAdminDashboard();
    res.json(result);
});
