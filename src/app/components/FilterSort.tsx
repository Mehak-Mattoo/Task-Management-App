// src/components/FilterSort.tsx
import React, { useState } from "react";
import { Priority, Status } from "../types";

interface FilterSortProps {
  onFilter: (priority: Priority | "All", status: Status | "All") => void;
  onSort: (order: "asc" | "desc") => void;
}

const FilterSort: React.FC<FilterSortProps> = ({ onFilter, onSort }) => {
  const [priority, setPriority] = useState<Priority | "All">("All");
  const [status, setStatus] = useState<Status | "All">("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Priority | "All";
    setPriority(value);
    onFilter(value, status);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Status | "All";
    setStatus(value);
    onFilter(priority, value);
  };

  const handleSortChange = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    onSort(newOrder);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <select
        value={priority}
        onChange={handlePriorityChange}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="All">All Priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <select
        value={status}
        onChange={handleStatusChange}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="All">All Statuses</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <button
        onClick={handleSortChange}
        className="flex items-center gap-1 px-3 py-2 border rounded hover:bg-gray-100"
      >
        Sort {sortOrder === "asc" ? "↑" : "↓"}
      </button>
    </div>
  );
};

export default FilterSort;