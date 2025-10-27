import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Check if user has access to a project
export const checkProjectAccess = async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.id || req.params.projectId);
    const userId = req.user.id;

    // Check if user is owner
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    if (project) {
      req.project = project;
      req.userRole = "owner";
      return next();
    }

    // Check if user is assigned to project
    const assignment = await prisma.projectAssignment.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      include: {
        project: true,
      },
    });

    if (assignment) {
      req.project = assignment.project;
      req.userRole = assignment.role;
      return next();
    }

    return res.status(403).json({ error: "Access denied to this project" });
  } catch (error) {
    console.error("Permission check error:", error);
    return res.status(500).json({ error: "Permission check failed" });
  }
};

// Check if user has specific role or higher
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Role hierarchy: owner > admin > member > viewer
    const roleHierarchy = {
      owner: 4,
      admin: 3,
      member: 2,
      viewer: 1,
    };

    const userLevel = roleHierarchy[req.userRole] || 0;
    const requiredLevel = Math.max(
      ...allowedRoles.map((role) => roleHierarchy[role] || 0)
    );

    if (userLevel >= requiredLevel) {
      return next();
    }

    return res.status(403).json({ 
      error: "Insufficient permissions",
      required: allowedRoles,
      current: req.userRole 
    });
  };
};

// Check if user is project owner
export const requireOwner = requireRole(["owner"]);

// Check if user is owner or admin
export const requireAdmin = requireRole(["owner", "admin"]);

// Check if user can edit (owner, admin, or member)
export const requireMember = requireRole(["owner", "admin", "member"]);
