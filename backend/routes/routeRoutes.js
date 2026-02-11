import express from "express";
import { rankRoutes } from "../controllers/routeController.js";

const router = express.Router();

router.post("/rank", rankRoutes);

export default router;
