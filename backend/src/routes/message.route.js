import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const messageRouter = express.Router();


messageRouter.get("/user", protectRoute, getUsersForSidebar)
messageRouter.get("/:id", protectRoute, getMessages)
messageRouter.get("/send/:id", protectRoute, sendMessage)

export default messageRouter;