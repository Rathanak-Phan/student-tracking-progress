import * as service from "../service/request.service.js";

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const createRequest = asyncHandler(async (req, res) => {
    const requestId = await service.createRequest(req.user.id, req.body, req.files);
    res.status(201).json({ message: "Teacher verification request submitted successfully", id: requestId });
});

export const getMyRequest = asyncHandler(async (req, res) => {
    const request = await service.getMyRequest(req.user.id);
    res.json(request || { status: 'none' });
});

export const getPendingRequests = asyncHandler(async (req, res) => {
    const requests = await service.getPendingRequests();
    res.json(requests);
});

export const getRequestDetails = asyncHandler(async (req, res) => {
    const request = await service.getRequestDetails(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json(request);
});

export const approveRequest = asyncHandler(async (req, res) => {
    const result = await service.approveRequest(req.params.id, req.user.id);
    res.json(result);
});

export const rejectRequest = asyncHandler(async (req, res) => {
    const result = await service.rejectRequest(req.params.id, req.body.admin_note, req.user.id);
    res.json(result);
});
