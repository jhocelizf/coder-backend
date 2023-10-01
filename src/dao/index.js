//Config dotenv
import { configuration } from "../config/config.js"
configuration()

//Memory
import {ProductsMemoryDao} from "./memory/products.dao.js"
import {CarritoMemoryDao} from "./memory/cart.dao.js"
import { UsersMemoryDao } from "./memory/users.dao.js"
import { ChatMemoryDao } from "./memory/chat.dao.js"
import { TicketMemoryDao } from "./memory/ticket.dao.js"

//Mongo
import {ProductsMongoDao} from "./mongo/product.dao.js"
import {CarritoMongoDao} from "./mongo/cart.dao.js"
import { UsersMongoDao } from "./mongo/user.dao.js"
import { ChatMongoDao } from "./mongo/chat.dao.js"
import { TicketMongoDao } from "./mongo/ticket.dao.js"

export const product_dao = process.env.PERSISTENCE === "MONGO" ?  new ProductsMongoDao() : new ProductsMemoryDao()
export const cart_dao = process.env.PERSISTENCE === "MONGO" ?  new CarritoMongoDao() : new CarritoMemoryDao()
export const user_dao = process.env.PERSISTENCE === "MONGO" ? new UsersMongoDao() : new UsersMemoryDao()
export const message_dao= process.env.PERSISTENCE === "MONGO" ?  new ChatMongoDao() : new ChatMemoryDao()
export const ticket_dao = process.env.PERSISTENCE === "MONGO" ? new TicketMongoDao() : new TicketMemoryDao()