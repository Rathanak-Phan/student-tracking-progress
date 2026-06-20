import * as service from "../service/class.service.js";

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export const getClasses = asyncHandler(async (req, res) => {
    const result = await service.getAllClasses();
    res.json(result);
});

export const getClassDetails = asyncHandler(async (req, res) => {
    const result = await service.getClassDetails(req.params.id);
    res.json(result);
});

export const deleteClass = asyncHandler(async (req, res) => {
    const result = await service.deleteClass(req.params.id);
    res.json(result);
});
