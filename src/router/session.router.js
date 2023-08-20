import { Router } from "express";
import UserModel from "../dao/mongoManager/models/user.model.js";

const router = Router();

function auth(req, res, next) {
    console.log(req.session);
    if (req.session?.user && req.session?.admin) {
        return next();
    }
    return res.status(401).json("error de autenticacion");
}

router.post("/login", async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    const result = await UserModel.find({
        email: username,
        password,
    });
    console.log(result);
    if (result.length === 0)
        return res.status(401).json({
            respuesta: "error",
        });
    else {
req.session.user = username; 
req.session.admin = true;
res.status(200).json({
    respuesta: "ok", }); 
        // Verificar el rol basado en el correo electrónico del usuario
    }
});

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
    /*    req.session.user = email;
        req.session.admin = true;
        res.status(200).json({
            respuesta: "ok",
        }); */
        if (result.email === "admin@codercoder.com") {
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

router.get("/privado", auth, (req, res) => {
    res.render("topsecret", {});
});

export default router;