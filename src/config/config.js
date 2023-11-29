import dotenv from "dotenv"
import { Command } from "commander";

function configuration(){
    const command = new Command()
    command.option("--mode <mode>", "Modo de desarrollo", "prods") 
    command.parse()
    let mode = command.opts().mode
    dotenv.config({path: mode === "PRODUCTION" ? "./dev-env" : "./.env"});
}

export const PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT;
export const PAYPAL_API_SECRET = process.env.PAYPAL_API_SECRET;
export const PAYPAL_API = process.env.PAYPAL_API;

export {configuration}  

