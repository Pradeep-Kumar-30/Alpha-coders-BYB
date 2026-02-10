import express from "express";
import { anonymousLogin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/anonymous-login", anonymousLogin);

export default router;
