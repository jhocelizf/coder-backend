import MessageModel from "./models/message.model.js";

export class ChatMongoDao{

    async getMessages(){
        return await MessageModel.find({}).lean({})
    }

    async createMessage(message){
        return await MessageModel.create(message)
    }
}