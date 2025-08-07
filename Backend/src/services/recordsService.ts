import axios from "axios";
import { TaskRecord } from "src/types/recordType";

export const getAllTasks = async (): Promise<TaskRecord[] | undefined> => {
  try {
    const res = await axios.get(
      `https://api.airtable.com/v0/${process.env.BASE_ID}/${process.env.TABLE_NAME}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    return res.data.records;
  } catch (error: any) {
    console.error("Error checking tasks:", error);
  }
};
