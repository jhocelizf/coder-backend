import { user_dao } from "../dao/index.js";
import { UsersRepository } from "../dao/repository/users.repository.js";
import { CustomErrors } from "../errors/customErrors.js"
import { Errors } from "../errors/errors.js";
import { logger as LOGGER } from "../dao/index.js";

const userService = new UsersRepository(user_dao)

async function changeRoleUser(req,res){
    req.logger = LOGGER
    const {uid} = req.params
    try{
        const user = await userService.getUserById(uid)
        user.role = user.role === "user" ? "premium" : "user" 
        const response = await userService.modifyUser(uid,user)
        res.redirect("/")
    }catch(err){ 
        const error = CustomErrors.generateError({
            name: "Products Error",
            message: "Error get products",
            cause: err,
            code: Errors.DATABASE_ERROR
        })
        req.logger.error("Error " + JSON.stringify(error) + " " + new Date().toDateString())
        res.json({status: "error", error}) 
    } 
}

export {changeRoleUser}