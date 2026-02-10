import express from "express";
import { updateLocationPermission } from "../controllers/location.controller.js";

const router = express.Router();

router.post("/permission", updateLocationPermission);

export default router;
