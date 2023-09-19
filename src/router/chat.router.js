// import messageModel from "../dao/mongoManager/models/message.model.js";
import { Router } from "express";
import { getMessages } from "../controller/chat.controller.js";

const chatRouter = Router();

// chatRouter.get("/chat",(req,res)=>{
//     res.render("chat",{title:"Chat", script: "chat.js"})
// })

chatRouter.get("/",getMessages)

export default chatRouter;