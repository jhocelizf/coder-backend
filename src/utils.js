import fs from "fs";

import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))

export const isValidPassword = (savedPassword,password) =>{
    console.log("Saved password: " + savedPassword, "Password: " + password)
    return bcrypt.compareSync(savedPassword,password)
} 

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

async function readFile(file) {
    let readfilename = __dirname + "/" + file;
    try {
        let result = await fs.promises.readFile(readfilename, "utf-8");
        let data = await JSON.parse(result);
        return data;
    } catch (err) {
        return false;
    }
}

async function writeFile(file, data) {
    try {
        await fs.promises.writeFile(__dirname + "/" + file, JSON.stringify(data));
        return true;
    } catch (err) {
        console.log(err);
    }
}

async function deleteFile(file) {
    try {
        await fs.promises.unlink(__dirname + "/" + file);
        return true;
    } catch (err) {
        console.log(err);
    }
}

export default { readFile, writeFile, deleteFile };