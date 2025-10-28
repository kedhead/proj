import React from "react";

export default function ProjectCard({ project, onEdit, onDelete, onClick }) {
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-200"
      onClick={() => onClick && onClick(project.id)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {project.description && (
        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Start Date</p>
          <p className="font-medium text-gray-800">
            {formatDate(project.startDate)}
          </p>
        </div>
        <div>
          <p className="text-gray-500">End Date</p>
          <p className="font-medium text-gray-800">
            {formatDate(project.endDate)}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          {project.role || "Member"}
        </span>
      </div>
    </div>
  );
}
