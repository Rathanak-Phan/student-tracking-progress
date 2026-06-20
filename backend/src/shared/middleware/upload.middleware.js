import multer from "multer";
import path from "path";
import fs from "fs";

const createUploader = (destination, prefix) => {
  // Ensure the directory exists
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
      cb(null, `${prefix}-${Date.now()}${path.extname(file.originalname)}`);
    },
  });

  return multer({ storage });
};

// Default export: avatar uploader (keeps existing behaviour)
const upload = createUploader("uploads/avatars", "avatar");

// Named export: submission uploader
export const submissionUpload = createUploader("uploads/submissions", "submission");

// Named export: material uploader
export const materialUpload = createUploader("uploads/materials", "material");

// Named export: message media uploader
export const messageUpload = createUploader("uploads/messages", "message");

// Named export: document uploader for verifications
export const documentUpload = createUploader("uploads/documents", "document");

// Named export: class cover uploader
export const classCoverUpload = createUploader("uploads/covers", "cover");

export default upload;