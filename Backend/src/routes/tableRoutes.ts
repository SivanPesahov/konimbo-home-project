import express from "express";
import { CreateRecord } from "../controllers/tableController";

const router = express.Router();

router.post("/createRecord", CreateRecord);
// router.post("/createTable", CreateTable);

export default router;
