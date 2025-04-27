"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Task, Priority, Status } from "../types";

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  searchTasks: (query: string) => Task[];
  filterTasks: (priority?: Priority | "All", status?: Status | "All") => Task[];
  sortTasks: (order: "asc" | "desc") => void;
}

// Initial sample tasks (only used if no tasks in localStorage)
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Setup project structure",
    description:
      "Create the initial project structure with all necessary files",
    dueDate: "2025-05-12",
    priority: "Medium",
    status: "Completed",
  },
  // ... other initial tasks
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize state from localStorage or use initial tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    
    // Check if we're in a browser environment (important for Next.js)
    if (typeof window !== "undefined") {
      const storedTasks = localStorage.getItem("tasks");
      return storedTasks ? JSON.parse(storedTasks) : initialTasks;
    }
    return initialTasks;
  });

  // Save to localStorage whenever tasks change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Your other functions remain the same
  const searchTasks = (query: string): Task[] => {
    if (!query) return tasks;
    const lowerCaseQuery = query.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerCaseQuery) ||
        task.description.toLowerCase().includes(lowerCaseQuery)
    );
  };

  const filterTasks = (
    priority: Priority | "All" = "All",
    status: Status | "All" = "All"
  ): Task[] => {
    return tasks.filter((task) => {
      const priorityMatch = priority === "All" || task.priority === priority;
      const statusMatch = status === "All" || task.status === status;
      return priorityMatch && statusMatch;
    });
  };

  const sortTasks = (order: "asc" | "desc") => {
    const sortedTasks = [...tasks].sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
    setTasks(sortedTasks);
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    searchTasks,
    filterTasks,
    sortTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
