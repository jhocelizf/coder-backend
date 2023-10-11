//Config dotenv
import { configuration } from "../config/config.js"
configuration()

//Winston
import winston from "winston"

const devLogger = winston.createLogger({
    transports:[
        new winston.transports.Console({
            level: "debug"
        }),
        new winston.transports.Console({
            level: "http"
        })
    ]
})

const prodLogger = winston.createLogger({
    transports:[
        new winston.transports.Console({
            level: "info"
        }),
        new winston.transports.Console({
            level: "warn"
        }),
        new winston.transports.File({
            level: "error",
            filename: "./errors.log"
        }),
        new winston.transports.Console({
            level: "verbose"
        })
    ]
})

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
export const logger = process.env.ENVIRONMENT === "DEVELOPMENT" ? devLogger : prodLogger