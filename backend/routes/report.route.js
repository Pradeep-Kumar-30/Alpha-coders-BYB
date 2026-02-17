import express from "express";
import { submitReport, getReportsByLocation } from "../controllers/report.controller.js";

const router = express.Router();

router.post("/submit", submitReport);
router.get("/nearby", getReportsByLocation);

export default router;
