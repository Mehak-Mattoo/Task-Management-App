"use client";

import type React from "react";

import {
  AlignCenter,
  ChevronDown,
  ChevronUp,
  Edit,
  Plus,
  Search,
  SortAscIcon,
  Trash2,
  X,
  XIcon,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTaskContext, Task, Priority, Status } from "../context/TaskContext";

// Main Component
export default function TaskManagementApp() {
  const {
  
    addTask,
    updateTask,
    deleteTask,
    searchTasks,
    filterTasks,
    sortTasks,
    updateTaskPriority,
  } = useTaskContext();

  // Local state for UI
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "All">("All");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>(
    {}
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when search becomes visible
  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchVisible]);

  // Toggle expanded state for a task
  const toggleTaskExpand = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  // Process tasks with current filters and search
  let displayedTasks = searchTasks(searchQuery);
  displayedTasks = filterTasks(priorityFilter, statusFilter);
  displayedTasks = sortTasks(sortDirection);

  const openDeleteModal = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      closeDeleteModal();
    }
  };

  // UI handlers
  const handleAddTask = () => {
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleTaskSubmit = (taskData: Omit<Task, "id">) => {
    if (currentTask) {
      // Update task
      updateTask({ ...taskData, id: currentTask.id });
    } else {
      // Add task
      addTask(taskData);
    }
    setIsModalOpen(false);
  };

  const handlePriorityChange = (task: Task, newPriority: Priority) => {
    updateTaskPriority(task.id, newPriority);
  };

  // Toggle search visibility
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const getPriorityClass = (priority: Priority) => {
    switch (priority) {
      case "High":
        return "text-black";
      case "Medium":
        return "text-black";
      case "Low":
        return "text-black";
      default:
        return "text-black";
    }
  };

  const getStatusClass = (status: Status) => {
    switch (status) {
      case "Completed":
        return "bg-[#03A229] text-white";
      case "In Progress":
        return "bg-yellow-400 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Task modal component
  const TaskModal = () => {
    const initialData = currentTask || {
      title: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      priority: "Medium" as Priority,
      status: "In Progress" as Status,
    };

    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
      const newErrors: Record<string, string> = {};
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (!formData.description.trim())
        newErrors.description = "Description is required";
      if (!formData.dueDate) newErrors.dueDate = "Due date is required";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
      if (errors[name]) {
        setErrors({ ...errors, [name]: "" });
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (validate()) {
        handleTaskSubmit(formData);
      }
    };

    return (
      <div className="fixed inset-0 bg-[#000000E0] bg-opacity-20 flex items-center justify-center z-50">
        <div className="bg-white h-fit rounded-lg p-3 w-full max-w-md">
          <h2 className="text-lg md:text-xl flex justify-between font-bold mb-2">
            {currentTask ? "Edit Task" : "Add Task"}
            <XIcon
              className="cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            />
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label
                className="block text-gray-700 text-sm font-bold"
                htmlFor="title"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div className="mb-2">
              <label
                className="block text-gray-700 text-sm font-bold"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="mb-2">
              <label
                className="block text-gray-700 text-sm font-bold"
                htmlFor="dueDate"
              >
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${
                  errors.dueDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
              )}
            </div>

            <div className="mb-2">
              <label
                className="block text-gray-700 text-sm font-bold"
                htmlFor="priority"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold"
                htmlFor="status"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex w-full justify-center gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-1/2 p-2 text-sm md:text-base  font-medium text-red-800 border-2 border-red-800 cursor-pointer rounded hover:bg-red-800 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 p-2 text-sm md:text-base  font-medium text-white bg-red-800 rounded cursor-pointer hover:bg-red-900"
              >
                {currentTask ? "Update" : "Add"} Task
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <header className="mb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3"></div>

          {/* Search for desktop */}
          <div className="hidden md:block">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          {/* Search icon for mobile */}
          {!isSearchVisible && (
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleSearch}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Search className="h-5 w-5 text-red-800" />
              </button>
            </div>
          )}

          {/* Mobile search bar that appears when search icon is clicked */}
          {isSearchVisible && (
            <div
              ref={searchContainerRef}
              className="md:hidden mb-4 flex items-center border border-red-800 rounded overflow-hidden"
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 outline-none"
              />
              <button
                onClick={() => setIsSearchVisible(false)}
                className="p-2 text-red-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex  items-center justify-between flex-col sm:flex-row  gap-4 mb-5">
          <div className="">
            <h1 className="text-xl md:text-2xl font-bold">Tasks</h1>
          </div>
          <div className="flex  items-center justify-center  gap-2">
            <button
              onClick={handleAddTask}
              className="bg-red-800 hover:bg-red-900 text-xs sm:text-sm md:text-base items-center font-medium flex text-white px-3 py-[5px] rounded cursor-pointer"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1" />
              Add Task
            </button>
            <button
              onClick={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }
              className="flex items-center gap-1  border-red-900 border-2 text-red-800 font-medium rounded px-3 py-1  hover:bg-red-900 hover:text-white cursor-pointer"
            >
              <SortAscIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
              <p className="hidden md:block">Sort</p>
            </button>
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-1 px-3 py-1 border-red-900 border-2 text-red-800 font-medium rounded hover:bg-red-900 hover:text-white cursor-pointer"
              >
                <AlignCenter className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                <p className="hidden md:block">Filter</p>
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="p-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </p>
                    <select
                      value={priorityFilter}
                      onChange={(e) =>
                        setPriorityFilter(e.target.value as Priority | "All")
                      }
                      className="w-full mb-3 px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="All">All Priorities</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>

                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Status
                    </p>
                    <select
                      value={statusFilter}
                      onChange={(e) =>
                        setStatusFilter(e.target.value as Status | "All")
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="All">All Statuses</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Mobile View - Card Layout */}
        <div className="lg:hidden border border-red-800  rounded-md">
          {displayedTasks.length > 0 ? (
            <div className="grid gap-2">
              {displayedTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="rounded-lg overflow-hidden flex flex-col justify-between items-start"
                >
                  <div
                    className="p-3 cursor-pointer w-full"
                    onClick={() => toggleTaskExpand(task.id)}
                  >
                    {/* Top row: SL No + Index + Chevron */}
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center text-sm gap-2">
                        <span className="text-[#941B0F] grid grid-cols-[100px_1fr] font-medium">
                          SL.No
                        </span>
                        <span className="font-semibold text-gray-800">
                          {index + 1}
                        </span>
                      </div>
                      {expandedTasks[task.id] ? (
                        <ChevronUp size={18} className="text-[#941B0F] " />
                      ) : (
                        <ChevronDown size={18} className="text-[#941B0F] " />
                      )}
                    </div>

                    {/* Bottom row: Title */}
                    <div className="mt-2 text-sm  grid grid-cols-[109px_1fr] w-full">
                      <span className="text-[#941B0F] font-medium">Title</span>
                      <span className="font-semibold text-gray-800">
                        {task.title}
                      </span>
                    </div>
                  </div>

                  {expandedTasks[task.id] && (
                    <div className="p-3 ">
                      <div className="grid gap-2">
                        <div className="grid  text-sm  grid-cols-[100px_1fr] mb-2 gap-2">
                          <span className="text-red-800 font-medium">
                            Description:
                          </span>
                          <span className="font-medium">
                            {task.description}
                          </span>
                        </div>
                        <div className="grid  text-sm  grid-cols-[100px_1fr] mb-2  gap-2">
                          <span className="text-red-800 font-medium">
                            Due Date:
                          </span>
                          <span className="font-medium">
                            {formatDate(task.dueDate)}
                          </span>
                        </div>
                        <div className="grid  text-sm  my-2 grid-cols-[100px_1fr] gap-2">
                          <span className="text-red-800 font-medium">
                            Status:
                          </span>
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full w-fit ${getStatusClass(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start justify-between w-full gap-3  rounded">
                          {/* Priority Label + Select */}
                          <div className="flex  text-sm  items-center gap-2">
                            <span className="text-red-800 font-medium">
                              Priority:
                            </span>
                            <select
                              value={task.priority}
                              onChange={(e) =>
                                handlePriorityChange(
                                  task,
                                  e.target.value as Priority
                                )
                              }
                              className={`px-2 py-1 ml-13 text-xs leading-5 font-semibold rounded border ${getPriorityClass(
                                task.priority
                              )}`}
                            >
                              <option className="text-sm" value="High">
                                High
                              </option>
                              <option className="text-sm" value="Medium">
                                Medium
                              </option>
                              <option className="text-sm" value="Low">
                                Low
                              </option>
                            </select>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex sm:ml-20 gap-2">
                            <button
                              className="cursor-pointer p-2 rounded-full hover:bg-gray-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTask(task);
                              }}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(task.id);
                              }}
                              className="cursor-pointer p-2  rounded-full hover:bg-gray-200"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border border-red-800 rounded-lg">
              No tasks found
            </div>
          )}
        </div>

        {/* Desktop View - Table Layout */}
        <div className="hidden lg:block overflow-x-auto border border-red-800 rounded-xl">
          <table className="min-w-full ">
            <thead className="bg-[#fff9f8] border-b border-red-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                  Sl.No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="">
              {displayedTasks.length > 0 ? (
                displayedTasks.map((task, index) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {task.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium max-w-xs">
                      {task.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(task.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
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
                    <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                      <button
                        className="cursor-pointer p-2 rounded-full hover:bg-gray-200"
                        onClick={() => handleEditTask(task)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(task.id)}
                        className="cursor-pointer p-2 rounded-full hover:bg-gray-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {isDeleteModalOpen && (
        <div className="fixed inset-0  bg-[#000000E0] bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this task?
            </p>
            <div className="flex w-full justify-end gap-2">
              <button
                onClick={closeDeleteModal}
                className="w-1/2 p-2 font-medium text-red-800 border-2 border-red-800 cursor-pointer rounded hover:bg-red-800 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTask}
                className="w-1/2 p-2 font-medium border-2 border-red-800 cursor-pointer hover:bg-red-900 rounded bg-red-800 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && <TaskModal />}
    </div>
  );
}
