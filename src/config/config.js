import dotenv from "dotenv"
import { Command } from "commander";

function configuration(){
    const command = new Command()
    command.option("--mode <mode>", "Modo de desarrollo", "prods") 
    command.parse()
    let mode = command.opts().mode
    dotenv.config({path: mode === "PRODUCTION" ? "./dev-env" : "./.env"});
}

export {configuration}  

/* function configuration() {
    const command = new Command();
    command.option("--mode <mode>", "Modo de desarrollo", "prods");
    command.parse();
    let mode = command.opts().mode;

    if (mode === "PRODUCTION") {
        dotenv.config({ path: "./prod-env" });

        const mailing = {
            SERVICE: process.env.MAILING_SERVICE,
            USER: process.env.MAILING_USER,
            PASSWORD: process.env.MAILING_PASSWORD,
        };

        // Haz lo que necesites con la configuración de mailing en producción
        // Por ejemplo, puedes imprimir los valores en la consola
        console.log("Configuración de mailing en modo PRODUCCIÓN:", mailing);
    } else {
        dotenv.config({ path: "./.env" });

        const mailing = {
            SERVICE: process.env.MAILING_SERVICE,
            USER: process.env.MAILING_USER,
            PASSWORD: process.env.MAILING_PASSWORD,
        };

        // Haz lo que necesites con la configuración de mailing en otros modos
        // Por ejemplo, puedes imprimir los valores en la consola
        console.log("Configuración de mailing en otros modos:", mailing);
    }
}

export { configuration }; */
