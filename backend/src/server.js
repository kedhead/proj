import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import taskRoutes from "./routes/tasks.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", taskRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
