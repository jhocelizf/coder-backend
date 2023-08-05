import express from "express";
import { Router } from "express";
import ProductModel from "../dao/mongoManager/models/product.model.js";
import cartModel from "../dao/mongoManager/models/cart.model.js";
// import CartsManager from "../services/ProductManager.js";



const router = Router();
// const cartsManager = new CartsManager("carts.json");

/* router.use(express.json());
router.use(express.urlencoded({ extended: true })); */

// funciona
router.post("/", async (req, res) => {
    try {
        await cartModel.insertMany();
        res.send({
            status: "Success",
            message: "el carrito se añadio correctamente",
        });
    } catch (err) {
        res.status(err.statusCode).send(` ${err}`);
    }
}); 

// esta opcion tambien funciona
/* 
router.post("/", async (req, res) => {
    const cart = {
        products : []
    }
    let result = await cartModel.insertMany([cart])
    return res.json({message: "carrito creado correctamente"})
});
 */

router.get("/:cid", async (req, res) => {
    let { cid } = req.params;
    try {
        // Obtener un carrito por su ID
        let cart = await cartModel.findById(cid);
        res.send({ cart });
    } catch (error) {
        res.status(400).send({ status: "Error", error: "Carrito no encontrado" });
    }
});

// no anda no da la cantindad
router.post("/:cid/product/:pid", async (req, res) => {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    const quantity = req.body.quantity;
    try {
        const cart = await cartModel.findById(
            idCart
        );
        cart.products.push({ product : idProduct, quantity });
        const updatedCart = await cart.save();
        res.json(updatedCart);
        // res.json({ status: "200 ok", message: cart });
    } catch (err) {
        res.status(err.statusCode).send(` ${err}`);
    }
});

export default router;