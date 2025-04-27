import { NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import TaskTable from "../components/TaskTable";
import TaskModal from "../components/TaskModal";
import SearchBar from "../components/SearchBar";

import { Task, Priority, Status } from "../types";
import { useTaskContext } from "../context/TaskContext";
import FilterSort from "../components/FilterSort";

const Home: NextPage = () => {
  const { tasks, searchTasks, filterTasks, sortTasks } = useTaskContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "All">("All");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (priority: Priority | "All", status: Status | "All") => {
    setPriorityFilter(priority);
    setStatusFilter(status);
  };

  const handleSort = (order: "asc" | "desc") => {
    sortTasks(order);
  };

  const handleAddTask = () => {
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  let displayedTasks = searchQuery ? searchTasks(searchQuery) : tasks;
  if (priorityFilter !== "All" || statusFilter !== "All") {
    displayedTasks = filterTasks(priorityFilter, statusFilter);
  }

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Task Management App</title>
        <meta
          name="description"
          content="A task management application built with Next.js"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Task Management</h1>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <SearchBar onSearch={handleSearch} />
          <div className="flex gap-2">
            <FilterSort onFilter={handleFilter} onSort={handleSort} />
            <button
              onClick={handleAddTask}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Task
            </button>
          </div>
        </div>
      </header>

      <main>
        <TaskTable tasks={displayedTasks} onEdit={handleEditTask} />
      </main>

      {isModalOpen && (
        <TaskModal task={currentTask} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Home;
