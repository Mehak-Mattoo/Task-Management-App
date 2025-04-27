// src/components/TaskTable.tsx
import React from "react";
import { Task, Priority } from "../types";
import { useTaskContext } from "../context/TaskContext";


interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit }) => {
  const { deleteTask, updateTask } = useTaskContext();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePriorityChange = (task: Task, newPriority: Priority) => {
    updateTask({
      ...task,
      priority: newPriority,
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {task.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                  {task.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(task.dueDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={task.priority}
                    onChange={(e) =>
                      handlePriorityChange(task, e.target.value as Priority)
                    }
                    className={`px-2 py-1 text-xs leading-5 font-semibold rounded border ${getPriorityClass(
                      task.priority
                    )}`}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(task)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                   Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No tasks found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
