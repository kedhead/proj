# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Production project management system built with SVAR React Gantt. Features include user authentication, project dashboard, Gantt chart with inline/context menu editing, color-coded timeline, and automatic dependency-based date adjustments.

**Critical:** This runs on production VPS at 107.173.91.179 using Docker. All development happens on production server. NO fake data.

## Safety Rules

**ALWAYS consult user before:**
- Making destructive changes
- Modifying Docker configuration
- Changing database schema
- Altering authentication system
- Major refactoring

**Development workflow:**
- Use tdd-guard hooks for test-driven development
- Reference SVAR Gantt docs: https://svar.dev/react/gantt/
- Plan step-by-step with user approval
- Real data only - no mocks or placeholders

## Development Commands

### Frontend (Vite + React)
- `cd frontend && npm run dev` - Start development server
- `cd frontend && npm run build` - Build for production
- `cd frontend && npm run preview` - Preview production build

### Backend (Node.js + Express)
- `cd backend && npm run dev` - Start with nodemon (auto-reload)
- `cd backend && npm start` - Start production server
- `cd backend && npm run prisma:generate` - Generate Prisma Client
- `cd backend && npm run prisma:migrate` - Run database migrations
- `cd backend && npm run prisma:studio` - Open Prisma Studio (DB GUI)

### Docker
- `docker-compose up -d` - Start all services in background
- `docker-compose down` - Stop all services
- `docker-compose logs -f` - View logs
- `docker-compose build` - Rebuild containers

## Architecture

### Technology Stack
- **Frontend:** Vite + React 19 + SVAR React Gantt (@svar-ui/react-gantt) + Tailwind CSS + Zustand
- **Backend:** Node.js 20 + Express + Prisma ORM + JWT Authentication
- **Database:** PostgreSQL 16 (Docker container)
- **Deployment:** Docker Compose on VPS 107.173.91.179

### Project Structure
```
/home/user/project-management/
├── frontend/              # React frontend
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── backend/               # Express API
│   ├── src/
│   │   ├── server.js     # Main entry point
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── middleware/
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml     # Docker orchestration
├── .env                   # Environment variables
└── .gitignore
```

### Database Schema
- **Users**: Authentication and profile info
- **Projects**: Project metadata, ownership
- **ProjectAssignments**: User-to-project mappings with roles
- **Tasks**: Gantt chart tasks with dependencies
- **TaskDependencies**: Task relationship definitions

### Key Features
- SVAR Gantt integration with full feature set (drag-drop, dependencies, milestones)
- User authentication and project assignment
- Clean dashboard for project overview
- Inline editing and context menu
- Color-coded timeline with auto-adjusting dates
- Mobile-responsive design

## Important References

- See `.cursorrules` for detailed development rules
- See `PROJECT_PLAN.md` for phased implementation plan
- SVAR Gantt docs: https://svar.dev/react/gantt/
- SVAR Gantt GitHub: https://github.com/svar-widgets/react-gantt
