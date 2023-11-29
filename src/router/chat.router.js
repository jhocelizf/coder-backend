// import messageModel from "../dao/mongoManager/models/message.model.js";
import { Router } from "express";
import { getMessages } from "../controller/chat.controller.js";

const chatRouter = Router();

chatRouter.get("/",getMessages)

export default chatRouter;