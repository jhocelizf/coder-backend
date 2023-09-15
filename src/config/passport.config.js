import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import crypto from "crypto";
import UserModel from "../dao/mongoManager/models/user.model.js";
import { createHash } from "../utils.js";
import dotenv from "dotenv";
import CartModel from "../dao/mongoManager/models/cart.model.js";
import jwt, {ExtractJwt} from "passport-jwt"

dotenv.config();

const LocalStrategy = local.Strategy
const JwtStrategy = jwt.Strategy
const GithubClientId = process.env.GITHUB_CLIENT_ID
const GithubClientSecret = process.env.GITHUB_CLIENT_SECRET
const GithubURL = process.env.GITHUB_URL_CALLBACK

const intializePassport = async () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, mail, pass, done) => {
        const { first_name, last_name, email, age, role, password } = req.body
        console.log(req.body);
        try {
            const userAccount = await UserModel.findOne({ email: email })
            if (userAccount) {
                return done(null, false, { message: "Tu usuario ya existe" })
            } else {
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    // cart: cart.id,
                    role: "user",
                    password: createHash(password)
                }
                const result = await UserModel.create(newUser)
                console.log(result)
                return done(null, result)
            }
        } catch (err) {
            return done(err)
        }
    }))
/* 
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({ email: email })
            if (!user) {
                return done(null, false, { message: "Tu usuario no existe" })
            } else {
                if (!isValidPassword(password, user.password)) {
                    return done(null, false, { message: "Contraseña incorrecta" })
                } else {
                    return done(null, user)
                }
            }
        } catch (err) {
            return done(err)
        }
    })) */

    passport.use("jwt", new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "CoderKeySecreta"
    },async(jwt_payload,done)=>{
        try{
            return done(null,jwt_payload)
        }catch(err){
            return done(err)
        }
    }))

    passport.use("github", new GithubStrategy({
        clientID: GithubClientId,
        clientSecret: GithubClientSecret,
        callbackURL: GithubURL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            const user = await UserModel.findOne({ email: profile.login + "@gmail.com" })
            if (!user) {
                const newUser = {
                    first_name: profile.displayName,
                    last_name: profile.displayName,
                    email: profile.login + "@gmail.com",
                    age: 18,
                    user: profile.username,
                    password: crypto.randomUUID()
                }
                const result = await UserModel.create(newUser)
                done(null, result)
            } else {
                done(null, user)
            }
        } catch (err) {
            done(err, null)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById(id)
        done(null, user)
    })
}

const cookieExtractor = (req)=>{
    let token = null
    if(req && req.cookies){
        token = req.cookies["coderCookieToken"]
    }
    return token
} 
export default intializePassport;