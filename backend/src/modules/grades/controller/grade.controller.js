import * as service from "../service/grade.service.js";
import { logActivity } from "../../logs/service/log.service.js";

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export const createGrade = asyncHandler(async (req, res) => {
    const { submission_id, score, feedback } = req.body;
    if (!submission_id || score === undefined) {
      return res.status(400).json({ message: "submission_id and score are required" });
    }

    const result = await service.gradeSubmission({ submission_id, score, feedback }, req.user.id);
    await logActivity(req.user.id, `Graded submission ID: ${submission_id}`);
    res.status(201).json(result);
});

export const getGrade = asyncHandler(async (req, res) => {
    const result = await service.getGradeBySubmission(req.params.submissionId);
    if (!result) return res.status(404).json({ message: "Grade not found" });
    res.json(result);
});
