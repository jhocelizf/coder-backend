import messageModel from "../dao/mongoManager/models/message.model.js";
import { Router } from "express";

const chatRouter = Router();

chatRouter.get('/chat', async (req, res) => {
    try {
        const messages = await messageModel.find().lean().exec();
        res.render('chat', { messages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default chatRouter;