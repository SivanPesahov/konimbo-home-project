import type { FormData } from "../components/formComponent";

export const taskFormFields: {
  name: keyof FormData;
  label: string;
  inputType: "text" | "select" | "date" | "textarea";
  placeholder?: string;
  options?: string[];
}[] = [
  {
    name: "taskName",
    label: "Task Name",
    inputType: "text",
    placeholder: "Enter task name",
  },
  {
    name: "assignee",
    label: "Assignee",
    inputType: "select",
    options: ["Sivan", "Shaked", "Elad", "Maya"],
  },
  {
    name: "dueDate",
    label: "Due Date",
    inputType: "date",
  },
  {
    name: "status",
    label: "Status",
    inputType: "select",
    options: ["Not Started", "In Progress", "Completed"],
  },
  {
    name: "priority",
    label: "Priority",
    inputType: "select",
    options: ["Low", "Medium", "High"],
  },
  {
    name: "notes",
    label: "Notes",
    inputType: "textarea",
    placeholder: "Add notes here...",
  },
];
