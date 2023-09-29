import UserModel from "./models/user.model.js";

export class UsersMongoDao {

    async getUsers() {
        return await UserModel.find({});
    }

    async getUserByEmail(email) {
        return await UserModel.findOne({ email: email })
    }

    async createUser(user) {
        return await UserModel.create(user)
    }

    async deleteUser(id) {
        return await UserModel.findByIdAndDelete(id)
    }

    async getUserById(id) {
        return await UserModel.findById(id)
    }
}