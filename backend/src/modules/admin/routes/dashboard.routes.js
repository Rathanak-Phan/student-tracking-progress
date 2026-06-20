import { Router } from "express";
import * as controller from "../controller/dashboard.controller.js";
import { authorizePermission } from "../../../shared/middleware/permission.middleware.js";

const router = Router();

router.get("/", authorizePermission("admin.dashboard"), controller.getDashboard);

export default router;
