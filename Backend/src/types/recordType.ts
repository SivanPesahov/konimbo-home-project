export interface AirtableRecordInput {
  taskName: string;
  assignee: "Sivan" | "Elad" | "Shaked" | "Maya";
  dueDate: string;
  status: "Not Started" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  notes: string;
}

export type TaskRecord = {
  id: string;
  createdTime: string;
  fields: {
    "Task Name": string;
    Assignee?: string[];
    "Due Date"?: string;
    Status?: "Not Started" | "In Progress" | "Completed";
    Priority?: "Low" | "Medium" | "High";
    Notes?: string;
  };
};
