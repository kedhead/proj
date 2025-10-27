import express from "express";
import { body } from "express-validator";
import {
  getProjectTasks,
  createTask,
  updateTask,
  deleteTask,
  bulkUpdateTasks,
  createDependency,
  deleteDependency,
} from "../controllers/taskController.js";
import { authenticateToken } from "../middleware/auth.js";
import { checkProjectAccess, requireMember } from "../middleware/permissions.js";

const router = express.Router();

const taskValidation = [
  body("text").trim().notEmpty().withMessage("Task name required"),
  body("type").optional().isIn(["task", "summary", "milestone"]).withMessage("Invalid task type"),
  body("start").isISO8601().withMessage("Valid start date required"),
  body("end").isISO8601().withMessage("Valid end date required"),
  body("duration").optional().isInt({ min: 0 }).withMessage("Duration must be positive"),
  body("progress").optional().isFloat({ min: 0, max: 1 }).withMessage("Progress must be 0-1"),
];

const dependencyValidation = [
  body("sourceId").isInt().withMessage("Valid source task ID required"),
  body("targetId").isInt().withMessage("Valid target task ID required"),
  body("type").optional().isIn(["0", "1", "2", "3"]).withMessage("Invalid dependency type"),
];

// Get all tasks for a project
router.get("/projects/:projectId/tasks", authenticateToken, checkProjectAccess, getProjectTasks);

// Create task in project
router.post("/projects/:projectId/tasks", authenticateToken, checkProjectAccess, requireMember, taskValidation, createTask);

// Update task
router.put("/tasks/:id", authenticateToken, requireMember, updateTask);

// Delete task
router.delete("/tasks/:id", authenticateToken, requireMember, deleteTask);

// Bulk update tasks (for drag-and-drop)
router.post("/tasks/bulk-update", authenticateToken, bulkUpdateTasks);

// Create dependency
router.post("/tasks/dependencies", authenticateToken, dependencyValidation, createDependency);

// Delete dependency
router.delete("/tasks/dependencies/:id", authenticateToken, deleteDependency);

export default router;
