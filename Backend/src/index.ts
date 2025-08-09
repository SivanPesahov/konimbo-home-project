import { Request, Response } from "express";
import dotenv from "dotenv";
import tableRoutes from "./routes/tableRoutes";
import app from "./app";
dotenv.config();

import cron from "node-cron";
import { checkCompletedTasksAndNotify } from "./automations/mailAutomation";
import { createNewRecordAndEmptyOldRecord } from "./automations/updatingRecordsAutomations";

async function main() {
  app.use("/api/table", tableRoutes);

  // -- for deployment
  // app.get("*", (req: Request, res: Response) => {
  //   res.sendFile(path.join(__dirname, "public", "index.html"));
  // });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  cron.schedule("* * * * *", async () => {
    // console.log("🔁 Checking completed tasks...");
    // await checkCompletedTasksAndNotify();
    // console.log("🔁 Checking for records to update...");
    // await createNewRecordAndEmptyOldRecord();
  });
}

main().catch((err) => console.error(err));
