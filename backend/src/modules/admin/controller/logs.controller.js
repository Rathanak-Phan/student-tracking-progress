import * as service from "../service/logs.service.js";

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export const getLogs = asyncHandler(async (req, res) => {
    const result = await service.getActivityLogs(req.query);
    res.json(result);
});
