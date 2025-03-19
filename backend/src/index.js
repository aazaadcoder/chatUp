import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { connectDB } from "../lib/db.js";
import messageRouter from "./routes/message.route.js";
import cors from "cors";
const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());  // allow us to parse the cookies in req
app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials :true
  }
));


app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

app.listen(PORT, () => {
  console.log("listening on port:" + PORT);
  connectDB();
});
