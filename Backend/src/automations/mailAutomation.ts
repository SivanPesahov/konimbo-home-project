import axios from "axios";
import nodemailer from "nodemailer";
import { TaskRecord } from "src/types/recordType";
import { getAllTasks } from "../services/recordsService";

let notifiedTasks = new Set<string>();

const sendCompletionEmail = async (fields: TaskRecord["fields"]) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const recordName = fields["Task Name"];
  const assignee = Array.isArray(fields["Assignee"])
    ? fields["Assignee"].join(", ")
    : fields["Assignee"];

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.RECIVER_MAIL,
    subject: `Task "${recordName}" Completed`,
    text: `The task "${recordName}" assigned to ${assignee} has been marked as completed.`,
  });

  console.log("Email sent:", info.messageId);
};

export const checkCompletedTasksAndNotify = async () => {
  try {
    const tasks = await getAllTasks();

    for (const task of tasks as TaskRecord[]) {
      const { id, fields } = task;

      if (fields.Status === "Completed" && !notifiedTasks.has(id)) {
        await sendCompletionEmail(fields);
        notifiedTasks.add(id);
      }
    }
  } catch (err) {
    console.error("Error checking tasks:", err);
  }
};
