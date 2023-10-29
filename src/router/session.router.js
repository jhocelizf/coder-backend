import { Router } from "express";
import { isValidPassword } from "../utils.js";
import passport from "passport";
import { generateToken, passportCall, authorization } from "../utils.js";
import UserModel from "../dao/mongo/models/user.model.js";
import UsersDTO from "../dao/DTO/user.dto.js";
import { transport } from "../mailler/nodemailer.js";
import { createHash } from "../utils.js";

const router = Router();
// const userServise = new UserDTO();

let userTemp = ""

//Login con jwt   
router.post("/login", async (req, res) => {
    const { email, password } = req.body
    // console.log(req.body);
    const user = await UserModel.findOne({ email: email })
    // console.log(user);
    if (!user) {
        return res.json({ status: "error", message: "User not found" })
    } else {
        if (!isValidPassword(password, user.password)) {
            return res.json({ status: "error", message: "Invalid password" })
        } else {
            const myToken = generateToken(user)
            res.cookie("coderCookieToken", myToken, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true
            })
            return res.json({ status: "success" })
        }
    }
})

//Ruta si falla el login
router.get("/failLogin", (req, res) => {
    res.send({ error: "Error login" })
})

router.get("/current", passportCall("jwt"), async (req, res) => {
    // res.send(req.user)
    if (req.isAuthenticated()) {
        const user = req.user;
        return res.render("current", {
            title: "User",
            user: user
        });
    } else {
        return res.render("error", {
            title: "Error",
            message: "No estás autenticado"
        });
    }
})

router.post("/signup", passport.authenticate("register", {
    failureRedirect: "/failRegister"
}), async (req, res) => {
    try {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            cart: req.user.cart,
        };

        // console.log("estan llegando ??", req.session.user);

        res.status(200).json({
            status: "OK",
            message: "User created",
            user: req.session.user,
        });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({
            status: "Error",
            message: "Error creating user",
            error: err.message,
        });
    }
});

//Ruta por si falla el registro
router.get("/failRegister", (req, res) => {
    res.send({ error: "Error register" })
})


//Registro con github
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    req.session.first_name = req.user.first_name
    req.session.last_name = req.user.last_name
    req.session.user = req.user.user
    req.session.email = req.user.email
    req.session.password = req.user.password
    req.session.role = "user"
    console.log(req.user)
    req.session.role = "user"
    res.redirect("/")
})

//Recuperar contraseña
router.get("/recover", (req, res) => {
    res.render("recoverPassword", { title: "Recover password", script: "recoverPassword.js", style: "recoverPassword.css", PORT: process.env.PORT })
})
router.post("/recovePassword", async (req, res) => {
    const { mail } = req.body
    try {
        await transport.sendMail({
            from: "Forgot password <coder123@gmail.com>",
            to: mail,
            subject: "Forgot password",
            headers: {
                'Expiry-Date': new Date(Date.now() + 3600 * 1000).toUTCString()
            },
            html: `
            <h1>Forgot password</h1>
         <a href="http://localhost:${process.env.PORT}/replacePassword"><button>Recuperar contraseña</button></a>
        `
        })
        userTemp = await userService.getUserByEmail(mail)
        res.json({ status: "success", message: "Mail sended" })
    } catch (err) {
        console.log(err)
    }
})
router.get("/replacePassword", (req, res) => {
    res.render("replacePassword", { title: "Replace Password", style: "replacePassword.css", script: "replacePassword.js" })
})

router.post("/replace", async (req, res) => {
    try {
        const { pass } = req.body
        const user = await userService.getUserByEmail(userTemp.email)
        console.log(user.password)
        if (isValidPassword(pass, user.password)) {
            return res.json({ status: "error", message: "same password" })
        } else {
            user.password = createHash(pass)
            const data = await userService.modifyUser(user.id, user)
            res.json({ status: "Success", message: "Password replaced", data })
        }
    } catch (err) {
        console.log(err)
    }
})

export default router;