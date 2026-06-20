import * as service from "../service/class.service.js";
import { logActivity } from "../../logs/service/log.service.js"; // Updated path to logs service
import { asyncHandler } from "../../../shared/utils/asyncHandler.js";

export const createClass = asyncHandler(async (req, res) => {
    const data = { ...req.body };
    if (req.file) {
        data.cover_image = `/uploads/covers/${req.file.filename}`;
    }
    const result = await service.createClass(data, req.user);
    await logActivity(req.user.id, `Created class: ${req.body.name}`);
    res.status(201).json(result);
});

export const getAllClasses = asyncHandler(async (req, res) => {
    const data = await service.getAllClasses(req.user);
    res.json(data);
});

export const getClassById = asyncHandler(async (req, res) => {
    const data = await service.getClassById(req.params.id);
    res.json(data);
});

export const deleteClass = asyncHandler(async (req, res) => {
    await service.deleteClass(req.params.id, req.user);
    await logActivity(req.user.id, `Deleted class ID: ${req.params.id}`);
    res.json({ message: "Deleted successfully" });
});

export const joinClass = asyncHandler(async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ message: "Class code is required" });
    }

    const result = await service.joinClass(code, req.user.id);
    await logActivity(req.user.id, `Joined class by code: ${code}`);
    res.json(result);
});

export const removeStudent = asyncHandler(async (req, res) => {
    const { id, studentId } = req.params;
    const result = await service.removeStudentFromClass(id, studentId, req.user);
    await logActivity(req.user.id, `Removed student ID: ${studentId} from class ID: ${id}`);
    res.json(result);
});

export const updateClass = asyncHandler(async (req, res) => {
    const data = { ...req.body };
    if (req.file) {
        data.cover_image = `/uploads/covers/${req.file.filename}`;
    }
    const result = await service.updateClass(req.params.id, data, req.user);
    res.json(result);
});

export const getEnrolledStudents = asyncHandler(async (req, res) => {
    const result = await service.getEnrolledStudents(req.params.id, req.user);
    res.json(result);
});

export const getPendingJoinRequests = asyncHandler(async (req, res) => {
    const result = await service.getPendingJoinRequests(req.params.id, req.user);
    res.json(result);
});

export const approvePendingRequest = asyncHandler(async (req, res) => {
    const { id, requestId } = req.params;
    const result = await service.approvePendingRequest(parseInt(requestId), parseInt(id), req.user);
    await logActivity(req.user.id, `Approved join request for class ID: ${id}`);
    res.json(result);
});

export const rejectPendingRequest = asyncHandler(async (req, res) => {
    const { id, requestId } = req.params;
    const result = await service.rejectPendingRequest(parseInt(requestId), parseInt(id), req.user);
    await logActivity(req.user.id, `Rejected join request for class ID: ${id}`);
    res.json(result);
});