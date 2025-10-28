const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const tasksAPI = {
  async getAll(projectId, token) {
    const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch tasks");
    }
    return response.json();
  },

  async getById(projectId, taskId, token) {
    const response = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch task");
    }
    return response.json();
  },

  async create(projectId, taskData, token) {
    const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create task");
    }
    return response.json();
  },

  async update(projectId, taskId, taskData, token) {
    const response = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update task");
    }
    return response.json();
  },

  async delete(projectId, taskId, token) {
    const response = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete task");
    }
    return response.json();
  },

  async bulkUpdate(projectId, tasks, token) {
    const response = await fetch(`${API_URL}/projects/${projectId}/tasks/bulk`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tasks }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to bulk update tasks");
    }
    return response.json();
  },
};
