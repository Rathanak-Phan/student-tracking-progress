import { Router } from "express";
import * as controller from "../controller/logs.controller.js";
import { authorizePermission } from "../../../shared/middleware/permission.middleware.js";

const router = Router();

router.get("/", authorizePermission("admin.logs"), controller.getLogs);

export default router;
