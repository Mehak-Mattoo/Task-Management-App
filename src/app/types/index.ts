export type Priority = "High" | "Medium" | "Low";
export type Status = "In Progress" | "Completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
}
