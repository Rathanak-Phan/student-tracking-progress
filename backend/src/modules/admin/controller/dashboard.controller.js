import * as service from "../service/dashboard.service.js";

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export const getDashboard = asyncHandler(async (req, res) => {
    const result = await service.getAdminDashboard();
    res.json(result);
});
