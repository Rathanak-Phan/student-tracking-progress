import * as service from "../service/material.service.js";
import { logActivity } from "../../logs/service/log.service.js";
import { asyncHandler } from "../../../shared/utils/asyncHandler.js";

export const createMaterial = asyncHandler(async (req, res) => {
  const { title, class_id } = req.body;
  if (!req.file) throw new Error("File is required");

  const result = await service.createMaterial({
    title,
    class_id,
    file_url: `/uploads/materials/${req.file.filename}`
  }, req.user.id);

  await logActivity(req.user.id, `Uploaded material: ${title}`);
  res.status(201).json(result);
});

export const getMaterialsByClass = asyncHandler(async (req, res) => {
  const { class_id } = req.query;
  if (!class_id) return res.status(400).json({ message: "class_id is required" });
  
  const result = await service.getMaterialsByClass(class_id, req.user.id);
  res.json(result);
});

export const getMaterialById = asyncHandler(async (req, res) => {
  const result = await service.getMaterialById(req.params.id);
  res.json(result);
});

export const updateMaterial = asyncHandler(async (req, res) => {
  const result = await service.updateMaterial(req.params.id, req.body, req.user.id);
  await logActivity(req.user.id, `Updated material ID: ${req.params.id}`);
  res.json(result);
});

export const deleteMaterial = asyncHandler(async (req, res) => {
  const result = await service.deleteMaterial(req.params.id, req.user.id);
  await logActivity(req.user.id, `Deleted material ID: ${req.params.id}`);
  res.json(result);
});
