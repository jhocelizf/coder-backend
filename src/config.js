import dotenv from "dotenv"
import { Command } from "commander"

function configuration(mode){
    dotenv.config({path: mode === "PRODUCTION" ? "./.env" : "./.dev-env"})

    return {
        PORT: process.env.PORT || 8080,
        ENVIRONMENT: mode ? "PRODUCTION" : "DEVELOPMENT",
    };
} 



export {configuration} 