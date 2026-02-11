import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";

import connectDb from "./config/db.js";


import authRoutes from "./routes/auth.route.js";
import locationRoutes from "./routes/location.route.js";
import routeRoutes from "./routes/routeRoutes.js";
import errorMiddleware from "./middleware/error.middleware.js";

let port = process.env.PORT || 6000;

let app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

connectDb();


app.get("/", (req, res) => {
  res.send("Server running");
});

app.use("/api/auth", authRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/routes", routeRoutes);


app.use(errorMiddleware);

app.listen(port, () => {
  connectDb();
  console.log("Server started");
});

