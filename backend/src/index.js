import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import { connectDB } from "../lib/db.js";
const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use("/api/auth", authRouter);
app.listen(PORT, () => {
  console.log("listening on port:" + PORT);
  connectDB();
});
