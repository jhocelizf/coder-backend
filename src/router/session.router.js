import { Router } from "express";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";
import { generateToken, passportCall, authorization } from "../utils.js";
import UserModel from "../dao/mongoManager/models/user.model.js";

const router = Router();

function auth(req, res, next) {
    console.log(req.session);
    if (req.session?.user && req.session?.admin) {
        return next();
    }
    return res.status(401).json("error de autenticacion");
}

// router.post("/login", async (req, res) => {
//     console.log(req.body);
//     const { username, password } = req.body;

//     const result = await User.find({
//         email: username,
//         password,
//     });
//     console.log(result);
//     if (result.length === 0)
//         return res.status(401).json({
//             respuesta: "error",
//         });
//     else {
//         req.session.user = username;
//         req.session.admin = true;
//         res.status(200).json({
//             respuesta: "ok",
//         });
//         // Verificar el rol basado en el correo electrónico del usuario
//     }
// });

// return res.status(401).json({ status: "Error", message: "Error de autenticación" })

//Login con jwt   
router.post("/login", async (req, res) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email: email })
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


router.get("/current", passportCall("jwt"), authorization("user"), (req, res) => {
    res.send(req.user)
})

router.post("/signup", async (req, res) => {
    const { first_name, last_name, age, email, password, role } = req.body;

    const result = await UserModel.create({
        first_name,
        last_name,
        age,
        email,
        password,
        role
    });
    console.log(result);
    if (result === null) {
        return res.status(401).json({
            respuesta: "error",
        });
    } else {
        if (result.email === "coder-admin@coder.com") {
            result.role = "admin";
        } else {
            result.role = "usuario";
        }

        req.session.user = result.email;
        req.session.admin = result.role === "admin";

        res.status(200).json({
            respuesta: "ok",
        });
    }
});

//Registro con passport
router.post("/register", passport.authenticate("register", {
    failureRedirect: "/failRegister"
}), async (req, res) => {
    return res.json({ status: "success", message: "Usuario registrado" })
})

//Ruta por si falla el registro
router.get("/failRegister", (req, res) => {
    res.send({ error: "Error register" })
})

//Login con passport   
// router.post("/login", passport.authenticate("login", {
//     failureRedirect: "/failLogin"
// }), async (req, res) => {
//     if (!req.user) {
//         return res.status(401).json({ status: "Error", message: "Error de autenticación" })
//     } else {
//         req.session.first_name = req.user.first_name
//         req.session.last_name = req.user.last_name
//         req.session.user = req.user.user
//         req.session.email = req.user.email
//         req.session.password = req.user.password
//         req.session.age = req.user.age
//         req.session.role = "user"
//         return res.json({
//             status: "OK",
//             message: "Logueado con exito"
//         })
//     }
// })

//Ruta si falla el login
router.get("/failLogin", (req, res) => {
    res.send({ error: "Error login" })
})


// router.get("/privado", auth, (req, res) => {
//     res.render("topsecret", {});
// });

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


export default router;