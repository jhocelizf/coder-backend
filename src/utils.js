import fs from "fs";

import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import passport from "passport";
import { log } from "console";

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))

export const isValidPassword = (password, savedPassword) =>{
    const valid=bcrypt.compareSync(password, savedPassword)
    return valid;
} 

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

let privateKey = "CoderKeySecreta"

export const generateToken = (user)=>{
    const token = jwt.sign({user},privateKey,{expiresIn: "1h"})
    return token
}

export const authToken = (req,res,next)=>{
    let auth = req.cookies.coderCookieToken
    console.log(auth);
    if(!auth) return res.json({status: "error", message: "Invalid auth"})

    const token = auth

    jwt.verify(token,privateKey,(err,user)=>{
        if(err) res.json({status: "error", message: "Invalid Token"})
        req.user = user
        next()
    })
}

export const authAdmin = (req,res,next)=>{
    if(req.user.user.role === "admin" || req.user.user.role === "premium") return next() 
    return res.send({status: "error", message: "Is not admin"})
}

export const passportCall = (strategy)=>{
    return async(req,res,next)=>{
        passport.authenticate(strategy,(error,user,info)=>{
            if(error) return next(error)
            if(!user) return res.json({status: "error", message: info.messages ? info.messages : info.toString()})
            req.user = user
            next()
        })(req,res,next)
    }
}

export const authorization = (role)=>{
    return async(req,res,next)=>{
        if(!req.user) return res.json({status: "error", message: "Unauthorized"})
        if(req.user.user.role !== role) return res.json({status: "error", message: "UnauthorizeD"})
        next()
    }
}

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