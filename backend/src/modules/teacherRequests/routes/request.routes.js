import express from "express";
import * as controller from "../controller/request.controller.js";
import { authenticate } from "../../../shared/middleware/auth.middleware.js";
import { documentUpload } from "../../../shared/middleware/upload.middleware.js";

const router = express.Router();

router.post("/", authenticate, documentUpload.fields([
    { name: 'degree_cert', maxCount: 1 },
    { name: 'id_card', maxCount: 1 },
    { name: 'other_certs', maxCount: 1 }
]), controller.createRequest);

router.get("/me", authenticate, controller.getMyRequest);

export default router;
