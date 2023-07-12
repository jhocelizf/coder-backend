import express from "express";
import { Router } from "express";
import CartsManager from "../models/CartsManager.js";


const router = Router();
const cartsManager = new CartsManager("carts.json");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/", async (req, res) => {
    try {
        await cartsManager.addCart();
        res.send({
            status: "Success",
            message: "el carrito se añadio correctamente",
        });
    } catch (err) {
        res.status(err.statusCode).send(` ${err}`);
    }
});

router.get("/:cid", async (req, res) => {
    let { cid } = req.params;
    try {
        // Obtener un carrito por su ID
        let cart = await cartsManager.getCartsById(parseInt(cid));
        res.send({ cart });
    } catch (error) {
        res.status(400).send({ status: "Error", error: "Carrito no encontrado" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const idCart = Number(req.params.cid);
    const idProduct = Number(req.params.pid);
    try {
        const cart = await cartsManager.addProductToCart(
            idCart,
            idProduct
        );
        res.json({ status: "200 ok", message: cart });
    } catch (err) {
        res.status(err.statusCode).send(` ${err}`);
    }
});

export default router;