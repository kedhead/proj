import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

// Get all tasks for a project
export const getProjectTasks = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        dependencies: {
          include: { target: { select: { id: true, text: true } } },
        },
        dependents: {
          include: { source: { select: { id: true, text: true } } },
        },
      },
      orderBy: { order: "asc" },
    });

    // Format for SVAR Gantt
    const formattedTasks = tasks.map(task => ({
      id: task.id,
      text: task.text,
      type: task.type,
      start: task.start,
      end: task.end,
      duration: task.duration,
      progress: task.progress,
      color: task.color,
      parent: task.parent,
      order: task.order,
      open: task.open,
      links: task.dependencies.map(dep => ({
        id: dep.id,
        source: dep.sourceId,
        target: dep.targetId,
        type: dep.type,
      })),
    }));

    res.json({ tasks: formattedTasks, total: tasks.length });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Create new task
export const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const projectId = parseInt(req.params.projectId);
    const { text, type, start, end, duration, progress, color, parent, order, open } = req.body;

    const task = await prisma.task.create({
      data: {
        projectId,
        text,
        type: type || "task",
        start: new Date(start),
        end: new Date(end),
        duration: duration || 1,
        progress: progress || 0,
        color,
        parent,
        order: order || 0,
        open: open !== undefined ? open : true,
      },
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const taskId = parseInt(req.params.id);
    const { text, type, start, end, duration, progress, color, parent, order, open } = req.body;

    const updateData = {};
    if (text !== undefined) updateData.text = text;
    if (type !== undefined) updateData.type = type;
    if (start !== undefined) updateData.start = new Date(start);
    if (end !== undefined) updateData.end = new Date(end);
    if (duration !== undefined) updateData.duration = duration;
    if (progress !== undefined) updateData.progress = progress;
    if (color !== undefined) updateData.color = color;
    if (parent !== undefined) updateData.parent = parent;
    if (order !== undefined) updateData.order = order;
    if (open !== undefined) updateData.open = open;

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    
    await prisma.task.delete({ where: { id: taskId } });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

// Bulk update tasks (for drag-and-drop operations)
export const bulkUpdateTasks = async (req, res) => {
  try {
    const { tasks } = req.body;
    
    if (!Array.isArray(tasks)) {
      return res.status(400).json({ error: "Tasks must be an array" });
    }

    const updates = tasks.map(task => 
      prisma.task.update({
        where: { id: task.id },
        data: {
          start: task.start ? new Date(task.start) : undefined,
          end: task.end ? new Date(task.end) : undefined,
          duration: task.duration,
          order: task.order,
          parent: task.parent,
          progress: task.progress,
        },
      })
    );

    await prisma.$transaction(updates);
    res.json({ message: "Tasks updated successfully", count: tasks.length });
  } catch (error) {
    console.error("Bulk update error:", error);
    res.status(500).json({ error: "Failed to update tasks" });
  }
};

// Create task dependency
export const createDependency = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { sourceId, targetId, type } = req.body;

    // Check for circular dependency
    const wouldCreateCycle = await checkCircularDependency(sourceId, targetId);
    if (wouldCreateCycle) {
      return res.status(400).json({ error: "Circular dependency detected" });
    }

    const dependency = await prisma.taskDependency.create({
      data: {
        sourceId,
        targetId,
        type: type || "0",
      },
    });

    res.status(201).json({ message: "Dependency created successfully", dependency });
  } catch (error) {
    console.error("Create dependency error:", error);
    res.status(500).json({ error: "Failed to create dependency" });
  }
};

// Delete task dependency
export const deleteDependency = async (req, res) => {
  try {
    const dependencyId = parseInt(req.params.id);
    
    await prisma.taskDependency.delete({ where: { id: dependencyId } });
    res.json({ message: "Dependency deleted successfully" });
  } catch (error) {
    console.error("Delete dependency error:", error);
    res.status(500).json({ error: "Failed to delete dependency" });
  }
};

// Helper function to check circular dependencies
async function checkCircularDependency(sourceId, targetId) {
  const visited = new Set();
  
  async function hasPath(from, to) {
    if (from === to) return true;
    if (visited.has(from)) return false;
    visited.add(from);
    
    const dependencies = await prisma.taskDependency.findMany({
      where: { sourceId: from },
    });
    
    for (const dep of dependencies) {
      if (await hasPath(dep.targetId, to)) return true;
    }
    return false;
  }
  
  return await hasPath(targetId, sourceId);
}
