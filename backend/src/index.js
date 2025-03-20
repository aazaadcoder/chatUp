import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { connectDB } from "../lib/db.js";
import messageRouter from "./routes/message.route.js";
import cors from "cors";
import { app, io, server } from "../lib/socket.js";


dotenv.config();

const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(express.json({limit : '50mb'}));
app.use(cookieParser());  // allow us to parse the cookies in req
app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials :true
  }
));


app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

app.get("/", (req,  res)=> {
  return res.json({message : "hello from server"})
})
server.listen(PORT, () => {
  console.log("listening on port:" + PORT);
  connectDB();
});
