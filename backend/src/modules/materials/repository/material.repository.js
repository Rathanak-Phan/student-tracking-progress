import db from "../../../database/index.js";

export const createMaterial = async (data) => {
  const { class_id, title, file_url } = data;
  const material = await db.models.materials.create({
    class_id, title, file_url
  });
  return material.id;
};

export const updateMaterial = async (id, data) => {
  const { title, file_url } = data;
  await db.models.materials.update(
    { title, file_url },
    { where: { id } }
  );
};

export const deleteMaterial = async (id) => {
  await db.models.materials.destroy({ where: { id } });
};

export const findMaterialsByClass = async (classId) => {
  return await db.models.materials.findAll({
    where: { class_id: classId },
    order: [['uploaded_at', 'DESC']],
    raw: true
  });
};

export const findMaterialById = async (id) => {
  return await db.models.materials.findByPk(id, { raw: true });
};
