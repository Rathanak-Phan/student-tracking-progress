import { Router } from "express";
import * as controller from "../controller/user.controller.js";
import { authorizePermission } from "../../../shared/middleware/permission.middleware.js";

const router = Router();

router.get("/", authorizePermission("user.read"), controller.getUsers);
router.post("/bulk-action", authorizePermission("user.update"), controller.bulkActionUsers);
router.get("/:id", authorizePermission("user.read"), controller.getUserById);
router.put("/:id", authorizePermission("user.update"), controller.updateUser);
router.delete("/:id", authorizePermission("user.delete"), controller.deleteUser);
router.patch("/:id/validate", authorizePermission("user.update"), controller.validateTeacher);
router.get("/:id/academic-record", authorizePermission("user.read"), controller.getStudentDetails);

export default router;
