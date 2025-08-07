import { TaskRecord } from "src/types/recordType";
import { CreateRecord } from "../controllers/tableController";
import { getAllTasks } from "../services/recordsService";
import axios from "axios";

const checkForLateAndUnfinishedRecords = (
  tasks: TaskRecord[]
): TaskRecord[] => {
  const lateRecords: TaskRecord[] = [];
  for (const task of tasks) {
    const taskDueDate: string | undefined = task.fields["Due Date"];
    const today = new Date().toISOString().split("T")[0];
    if (
      taskDueDate &&
      taskDueDate <= today &&
      task.fields.Status === "Not Started"
    ) {
      lateRecords.push(task);
    }
  }
  return lateRecords;
};

const EmptyRecord = async (record: TaskRecord) => {
  const data = {
    fields: {
      "Task Name": record.fields["Task Name"] + " - expired!",
      Assignee: [],
      "Due Date": null,
      Status: null,
      Priority: null,
      Notes: null,
    },
  };

  try {
    const response = await axios.patch(
      `https://api.airtable.com/v0/${process.env.BASE_ID}/${process.env.TABLE_ID}/${record.id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Record updated:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating record:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createNewRecordAndEmptyOldRecord = async () => {
  const tasks = await getAllTasks();

  const lateRecords = checkForLateAndUnfinishedRecords(tasks as TaskRecord[]);

  if (lateRecords.length > 0) {
    console.log(`${lateRecords.length} Old records found - Updating now!`);
  } else {
    console.log("No update needed!");
  }

  for (const record of lateRecords) {
    const newRecord = await CreateRecord(
      {
        body: {
          taskName: record.fields["Task Name"],
          assignee: Array.isArray(record.fields.Assignee)
            ? record.fields.Assignee[0]
            : record.fields.Assignee ?? "",
          dueDate: null,
          status: "In Progress",
          priority: record.fields.Priority,
          notes: record.fields.Notes,
        },
      } as any,
      {
        status: () => ({
          json: () => {},
        }),
      } as any
    );

    const editedRecord = await EmptyRecord(record);
  }
};
