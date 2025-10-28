const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const projectsAPI = {
  async getAll(token) {
    const response = await fetch(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (\!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch projects");
    }
    return response.json();
  },

  async getById(projectId, token) {
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (\!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch project");
    }
    return response.json();
  },

  async create(projectData, token) {
    const response = await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
    });
    if (\!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create project");
    }
    return response.json();
  },

  async update(projectId, projectData, token) {
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
    });
    if (\!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update project");
    }
    return response.json();
  },

  async delete(projectId, token) {
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (\!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete project");
    }
    return response.json();
  },
};
