import express from "express";
import { body } from "express-validator";
import {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  assignUser,
  removeUser,
  updateUserRole,
} from "../controllers/projectController.js";
import { authenticateToken } from "../middleware/auth.js";
import { checkProjectAccess, requireOwner, requireAdmin } from "../middleware/permissions.js";

const router = express.Router();

const projectValidation = [
  body("name").trim().notEmpty().withMessage("Project name required"),
  body("description").optional().trim(),
  body("startDate").isISO8601().withMessage("Valid start date required"),
  body("endDate").optional().isISO8601().withMessage("Valid end date required"),
  body("color").optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage("Valid hex color required"),
];

const assignmentValidation = [
  body("userId").isInt().withMessage("Valid user ID required"),
  body("role").optional().isIn(["owner", "admin", "member", "viewer"]).withMessage("Invalid role"),
];

const roleUpdateValidation = [
  body("role").isIn(["owner", "admin", "member", "viewer"]).withMessage("Invalid role"),
];

router.get("/", authenticateToken, getAllProjects);
router.post("/", authenticateToken, projectValidation, createProject);
router.get("/:id", authenticateToken, checkProjectAccess, getProject);
router.put("/:id", authenticateToken, checkProjectAccess, requireAdmin, projectValidation, updateProject);
router.delete("/:id", authenticateToken, checkProjectAccess, requireOwner, deleteProject);
router.post("/:id/assign", authenticateToken, checkProjectAccess, requireAdmin, assignmentValidation, assignUser);
router.delete("/:id/assign/:userId", authenticateToken, checkProjectAccess, requireAdmin, removeUser);
router.put("/:id/assign/:userId", authenticateToken, checkProjectAccess, requireAdmin, roleUpdateValidation, updateUserRole);

export default router;
