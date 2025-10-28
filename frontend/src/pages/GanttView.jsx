import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Gantt, 
  Toolbar, 
  ContextMenu,
  Editor,
  defaultToolbarButtons 
} from "@svar-ui/react-gantt";
import "@svar-ui/react-gantt/all.css";
import "../gantt.css";
import { tasksAPI } from "../api/tasks";
import { projectsAPI } from "../api/projects";
import useAuthStore from "../store/authStore";

export default function GanttView() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const [api, setApi] = useState(null);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [projectId]);

  useEffect(() => {
    if (!api) return;

    const handleUpdateTask = async (ev) => {
      const { action, obj } = ev;
      
      try {
        if (action === "add-task") {
          const newTask = await tasksAPI.create(projectId, obj, token);
          console.log("Task created:", newTask);
        } else if (action === "update-task") {
          await tasksAPI.update(projectId, obj.id, obj, token);
          console.log("Task updated:", obj.id);
        } else if (action === "delete-task") {
          await tasksAPI.delete(projectId, obj.id, token);
          console.log("Task deleted:", obj.id);
        }
      } catch (err) {
        console.error("Task operation failed:", err);
        alert(`Failed to ${action}: ${err.message}`);
        await loadData();
      }
    };

    api.on("update-task", handleUpdateTask);
    api.on("add-task", handleUpdateTask);
    api.on("delete-task", handleUpdateTask);

    return () => {
      api.detach("update-task");
      api.detach("add-task");
      api.detach("delete-task");
    };
  }, [api, projectId, token]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [projectData, tasksData] = await Promise.all([
        projectsAPI.getById(projectId, token),
        tasksAPI.getAll(projectId, token),
      ]);

      setProject(projectData);
      
      const allLinks = [];
      const tasksList = tasksData.tasks.map((task) => {
        if (task.links && task.links.length > 0) {
          allLinks.push(...task.links);
        }
        return {
          ...task,
          start: new Date(task.start),
          end: new Date(task.end),
        };
      });

      setTasks(tasksList);
      setLinks(allLinks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        id: "text",
        header: "Task name",
        width: 250,
        editor: "text",
      },
      {
        id: "start",
        header: "Start date",
        width: 120,
        align: "center",
        editor: "datepicker",
      },
      {
        id: "duration",
        header: "Duration",
        width: 80,
        align: "center",
        editor: "text",
      },
      {
        id: "type",
        header: "Type",
        width: 100,
        align: "center",
      },
      {
        id: "action",
        header: "",
        width: 50,
        align: "center",
      },
    ],
    []
  );

  const scales = useMemo(
    () => [
      { unit: "month", step: 1, format: "MMMM yyyy" },
      { unit: "day", step: 1, format: "d" },
    ],
    []
  );

  const taskTypes = useMemo(
    () => [
      { id: "task", label: "Task" },
      { id: "milestone", label: "Milestone" },
      { id: "summary", label: "Summary" },
    ],
    []
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Dashboard
          </button>
          <span className="text-2xl font-bold">{project?.name}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-50 border-b">
        {api && <Toolbar api={api} buttons={defaultToolbarButtons} />}
      </div>

      {/* Gantt Chart with Context Menu and Editor */}
      <div className="flex-1 overflow-hidden">
        <ContextMenu api={api}>
          <Gantt
            tasks={tasks}
            links={links}
            scales={scales}
            columns={columns}
            taskTypes={taskTypes}
            init={setApi}
          />
        </ContextMenu>
        {api && <Editor api={api} />}
      </div>
    </div>
  );
}
