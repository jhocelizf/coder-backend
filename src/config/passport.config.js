import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import crypto from "crypto";
import User from "../dao/mongoManager/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import dotenv from "dotenv";

dotenv.config();

const LocalStrategy = local.Strategy
const GithubClientId = process.env.GITHUB_CLIENT_ID
const GithubClientSecret = process.env.GITHUB_CLIENT_SECRET
const GithubURL = process.env.GITHUB_URL_CALLBACK

const intializePassport = async () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, mail, pass, done) => {
        const { first_name, last_name, email, age, user, password } = req.body
        try {
            const userAccount = await User.findOne({ email: email })
            if (userAccount) {
                return done(null, false, { message: "Tu usuario ya existe" })
            } else {
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    user,
                    password: createHash(password)
                }
                const result = await User.create(newUser)
                return done(null, result)
            }
        } catch (err) {
            return done(err)
        }
    }))

    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email: email })
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
    }))

    passport.use("github", new GithubStrategy({
        clientID: GithubClientId,
        clientSecret: GithubClientSecret,
        callbackURL: GithubURL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            const user = await User.findOne({ email: profile.login + "@gmail.com" })
            if (!user) {
                const newUser = {
                    first_name: profile.displayName,
                    last_name: profile.displayName,
                    email: profile.login + "@gmail.com",
                    age: 18,
                    user: profile.username,
                    password: crypto.randomUUID()
                }
                const result = await User.create(newUser)
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
        let user = await User.findById(id)
        done(null, user)
    })
}

export default intializePassport;