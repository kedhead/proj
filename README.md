# Project Management System

A modern, full-stack project management system built with SVAR React Gantt, featuring user authentication, project dashboards, and advanced Gantt chart capabilities.

## 🚀 Features

- **SVAR Gantt Integration**: Full-featured Gantt chart with drag-and-drop, dependencies, and milestones
- **User Authentication**: Secure JWT-based authentication
- **Project Management**: Create, edit, and manage projects with team assignments
- **Role-Based Access**: Owner, admin, member, and viewer roles
- **Inline & Context Menu Editing**: Edit tasks directly in the Gantt chart
- **Color-Coded Timeline**: Visual project organization
- **Auto-Adjusting Dates**: Dependencies automatically update related tasks
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technology Stack

### Frontend
- Vite + React 19
- SVAR React Gantt (@svar-ui/react-gantt)
- Tailwind CSS
- Zustand (State Management)
- React Router

### Backend
- Node.js 20 + Express
- Prisma ORM
- PostgreSQL 16
- JWT Authentication
- bcryptjs

### Infrastructure
- Docker & Docker Compose
- Nginx (Frontend proxy)
- VPS Deployment

## 📋 Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16 (via Docker)

## 🚦 Quick Start

### Development

1. **Start PostgreSQL**:
   ```bash
   docker-compose up -d postgres
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run dev
   ```

3. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Production (Docker)

1. **Configure Environment**:
   ```bash
   # Edit .env file with your secure credentials
   nano .env
   ```

2. **Build and Start**:
   ```bash
   docker-compose up -d --build
   ```

3. **Access**:
   - Frontend: http://107.173.91.179
   - Backend API: http://107.173.91.179/api

## 📂 Project Structure

```
/home/user/project-management/
├── frontend/              # React frontend
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf
├── backend/               # Express API
│   ├── src/
│   ├── prisma/
│   └── Dockerfile
├── docker-compose.yml
├── .env
└── README.md
```

## 🔐 Security

- All passwords are hashed with bcryptjs
- JWT tokens for stateless authentication
- CORS configured for API security
- Environment variables for sensitive data
- Security headers in nginx

## 📖 Documentation

- [Development Rules](.cursorrules)
- [Claude Code Guide](CLAUDE.md)
- [Implementation Plan](PROJECT_PLAN.md)
- [SVAR Gantt Docs](https://svar.dev/react/gantt/)

## 🧪 Testing

Testing setup with tdd-guard is configured. Run tests with:

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## 📝 License

This project uses SVAR React Gantt which is licensed under GPLv3.

## 🤝 Contributing

This is a production system. All changes require approval before deployment.

## 📧 Support

For issues or questions, refer to the documentation files or contact the system administrator.
