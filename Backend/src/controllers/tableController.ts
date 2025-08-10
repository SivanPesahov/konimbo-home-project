import { Request, Response } from "express";
import dotenv from "dotenv";
import { AirtableRecordInput } from "../types/recordType";

const axios = require("axios");

dotenv.config();

async function CreateRecord(
  req: Request<{}, {}, AirtableRecordInput>,
  res: Response
): Promise<void> {
  console.log("create record func");
  const url = `https://api.airtable.com/v0/${process.env.BASE_ID}/${process.env.TABLE_ID}`;
  try {
    const { taskName, assignee, dueDate, status, priority, notes } = req.body;

    if (!taskName) {
      res.status(400).json({ error: "Task name must be included" });
      return;
    }

    if (dueDate) {
      const due = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      due.setHours(0, 0, 0, 0);
      if (due < today) {
        res.status(400).json({ error: "Due date must be today or later" });
        return;
      }
    }

    const validStatuses = ["Not Started", "In Progress", "Completed"];
    const validPriorities = ["Low", "Medium", "High"];
    const validAssignees = ["Sivan", "Shaked", "Maya", "Elad"];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "Invalid status value" });
      return;
    }

    if (!validPriorities.includes(priority)) {
      res.status(400).json({ error: "Invalid priority value" });
      return;
    }

    if (!validAssignees.includes(assignee)) {
      res.status(400).json({ error: "Invalid assignee value" });
      return;
    }

    const payload = {
      records: [
        {
          fields: {
            "Task Name": taskName,
            Assignee: [assignee],
            "Due Date": dueDate,
            Status: status,
            Priority: priority,
            Notes: notes,
          },
        },
      ],
    };

    const createdRecord = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    res.status(201).json({
      message: "Record created successfully",
      record: createdRecord.data,
    });
  } catch (error: any) {
    console.log("error:", error.message);

    res.status(500).json({
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    console.log(error.message);
  }
}

export { CreateRecord };
