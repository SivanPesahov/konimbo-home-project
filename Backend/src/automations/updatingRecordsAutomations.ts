import { TaskRecord } from "src/types/recordType";
import { CreateRecord } from "../controllers/tableController";
import { getAllTasks } from "../services/recordsService";
import axios from "axios";

const checkForLateAndUnfinishedRecords = (
  records: TaskRecord[]
): TaskRecord[] => {
  const lateRecords: TaskRecord[] = [];
  for (const record of records) {
    const recordDueDate: string | undefined = record.fields["Due Date"];
    const today = new Date().toISOString().split("T")[0];
    if (
      recordDueDate &&
      recordDueDate <= today &&
      record.fields.Status === "Not Started"
    ) {
      lateRecords.push(record);
    }
  }
  return lateRecords;
};

const EmptyRecord = async (record: TaskRecord) => {
  const payload = {
    fields: {
      "Task Name": record.fields["Task Name"] + " - Expired!",
      Assignee: [],
      "Due Date": null,
      Status: null,
      Priority: null,
      Notes: null,
    },
  };

  try {
    const { data } = await axios.patch(
      `https://api.airtable.com/v0/${process.env.BASE_ID}/${process.env.TABLE_ID}/${record.id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    !data && console.log(`Record with id: ${record.id} was not found!`);

    console.log("Record updated:", data);
    return data;
  } catch (error: any) {
    console.error(
      "Error updating record:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createNewRecordAndEmptyOldRecord = async () => {
  const records = await getAllTasks();

  const lateRecords = checkForLateAndUnfinishedRecords(records as TaskRecord[]);

  lateRecords.length > 0
    ? console.log(`${lateRecords.length} Old records found - Updating now!`)
    : console.log("No update needed!");

  for (const record of lateRecords) {
    const newRecord = await CreateRecord(
      {
        body: {
          taskName: `${record.fields["Task Name"]} - Follow up`,
          assignee: Array.isArray(record.fields.Assignee)
            ? record.fields.Assignee[0]
            : record.fields.Assignee ?? "",
          dueDate: null,
          status: "In Progress",
          priority: record.fields.Priority,
          notes: record.fields.Notes
            ? `(Automatically created reminder for task that passed due date) ${record.fields.Notes}`
            : "Automatically created reminder for task that passed due date",
        },
      } as any,
      {
        status: () => ({
          json: () => {},
        }),
      } as any
    );

    await EmptyRecord(record);
  }
};
