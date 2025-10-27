import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

export const getAllProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const ownedProjects = await prisma.project.findMany({
      where: { ownerId: userId },
      include: {
        owner: { select: { id: true, email: true, firstName: true, lastName: true } },
        _count: { select: { tasks: true, assignments: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
    
    const assignments = await prisma.projectAssignment.findMany({
      where: { userId },
      include: {
        project: {
          include: {
            owner: { select: { id: true, email: true, firstName: true, lastName: true } },
            _count: { select: { tasks: true, assignments: true } },
          },
        },
      },
    });

    const assignedProjects = assignments.map((a) => ({ ...a.project, userRole: a.role }));
    res.json({
      owned: ownedProjects.map((p) => ({ ...p, userRole: "owner" })),
      assigned: assignedProjects,
      total: ownedProjects.length + assignedProjects.length,
    });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        owner: { select: { id: true, email: true, firstName: true, lastName: true } },
        assignments: { include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } } },
        tasks: { select: { id: true, text: true, type: true, start: true, end: true, progress: true }, orderBy: { order: "asc" } },
        _count: { select: { tasks: true, assignments: true } },
      },
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ ...project, userRole: req.userRole });
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
};

export const createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { name, description, startDate, endDate, color } = req.body;
    const project = await prisma.project.create({
      data: {
        name, description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        color: color || "#3b82f6",
        ownerId: req.user.id,
      },
      include: { owner: { select: { id: true, email: true, firstName: true, lastName: true } } },
    });
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { name, description, startDate, endDate, color } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    if (color !== undefined) updateData.color = color;

    const project = await prisma.project.update({
      where: { id: parseInt(req.params.id) },
      data: updateData,
      include: { owner: { select: { id: true, email: true, firstName: true, lastName: true } } },
    });
    res.json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
};

export const assignUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const projectId = parseInt(req.params.id);
    const { userId, role } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const assignment = await prisma.projectAssignment.upsert({
      where: { projectId_userId: { projectId, userId } },
      update: { role },
      create: { projectId, userId, role: role || "member" },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
    });
    res.status(201).json({ message: "User assigned successfully", assignment });
  } catch (error) {
    console.error("Assign user error:", error);
    res.status(500).json({ error: "Failed to assign user" });
  }
};

export const removeUser = async (req, res) => {
  try {
    await prisma.projectAssignment.delete({
      where: { projectId_userId: { projectId: parseInt(req.params.id), userId: parseInt(req.params.userId) } },
    });
    res.json({ message: "User removed from project" });
  } catch (error) {
    console.error("Remove user error:", error);
    res.status(500).json({ error: "Failed to remove user" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { role } = req.body;
    const assignment = await prisma.projectAssignment.update({
      where: { projectId_userId: { projectId: parseInt(req.params.id), userId: parseInt(req.params.userId) } },
      data: { role },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
    });
    res.json({ message: "User role updated successfully", assignment });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ error: "Failed to update user role" });
  }
};
