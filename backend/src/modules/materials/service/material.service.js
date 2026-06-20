import * as repo from "../repository/material.repository.js";
import * as classRepo from "../../classes/repository/class.repository.js";

export const createMaterial = async (data, userId) => {
  const classData = await classRepo.findById(data.class_id);
  if (!classData) throw new Error("Class not found");

  if (classData.teacher_id !== userId) {
    throw new Error("Unauthorized: Only the class teacher can upload materials");
  }

  const materialId = await repo.createMaterial(data);
  return { materialId };
};

export const updateMaterial = async (id, data, userId) => {
  const material = await repo.findMaterialById(id);
  if (!material) throw new Error("Material not found");

  const classData = await classRepo.findById(material.class_id);
  if (classData.teacher_id !== userId) {
    throw new Error("Unauthorized");
  }

  await repo.updateMaterial(id, data);
  return { message: "Material updated successfully" };
};

export const deleteMaterial = async (id, userId) => {
  const material = await repo.findMaterialById(id);
  if (!material) throw new Error("Material not found");

  const classData = await classRepo.findById(material.class_id);
  if (classData.teacher_id !== userId) {
    throw new Error("Unauthorized");
  }

  await repo.deleteMaterial(id);
  return { message: "Material deleted successfully" };
};

export const getMaterialsByClass = async (classId, userId) => {
  // Optional: Check if student is enrolled in the class
  return await repo.findMaterialsByClass(classId);
};

export const getMaterialById = async (id) => {
  const material = await repo.findMaterialById(id);
  if (!material) throw new Error("Material not found");
  return material;
};
