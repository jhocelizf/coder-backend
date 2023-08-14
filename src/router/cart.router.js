import express from "express";
import { Router } from "express";
import ProductModel from "../dao/mongoManager/models/product.model.js";
import cartModel from "../dao/mongoManager/models/cart.model.js";
// import CartsManager from "../dao/fileManager/ProductManager.js";



const router = Router();
// const cartsManager = new CartsManager("carts.json");

/* router.use(express.json());
router.use(express.urlencoded({ extended: true })); */

// funciona
router.post("/", async (req, res) => {
    try {
        await cartModel.insertOne();
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
        let cart = await cartModel.findById(cid);
        res.send({ cart });
    } catch (error) {
        res.status(400).send({ status: "Error", error: "Carrito no encontrado" });
    }
});

/* router.post("/:cid/product/:pid", async (req, res) => {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    const quantity = req.body.quantity;
    try {
        const cart = await cartModel.findById(
            idCart
        );
        let productExistsInCart = cart.products.findIndex(
            (dato) => dato.product == pid
        );
        
        productExistsInCart == -1
        ? cart.products.push({ product : idProduct, quantity: 1, })
        : (cart.products[productExistsInCart].quantity =
            cart.products[productExistsInCart].quantity + 1);
        const updatedCart = await cart.save();
        res.json(updatedCart);
        // res.json({ status: "200 ok", message: cart });
    } catch (err) {
        res.status(err.statusCode).send(` ${err}`);
    }
}); */

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    let cart = await cartModel.findOne({ _id: cid });

    if (cart) {
        const productoEnCarrito = cart.products.find(product => product.product.id === pid);

        if (productoEnCarrito) {
            productoEnCarrito.quantity++;
        } else {
            const product = await ProductModel.findById(pid);
            cart.products.push({
                product: product._id,
                quantity: 1
            });
        }

        const result = await cart.save();
        return res.json({ message: "Producto agregado", data: result });
    } else {
        return res.status(404).json({ message: "Carrito no encontrado" });
    }
})

router.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body
    let cart = await cartModel.findOne({ _id: cid })
    let productos = cart.products
    let producto = productos.findIndex((producto) => producto.product.id === pid)
    if (producto !== -1) {
        productos[producto].product.quantity = quantity
        let result = await cartModel.findByIdAndUpdate(cid, cart)
        return res.json({ message: "Cantidad de ejemplares actualizada", data: result })
    } else {
        return res.status(404).json({ message: "Producto no encontrado" })
    }
});

router.delete("/:cid",async(req,res)=>{
    const {cid} = req.params
    let cart = await cartModel.findById(cid)
    cart.products = []
    let result = await cartModel.findByIdAndUpdate(cid,cart)
    return res.json({message: "Carrito vacio", data: result})
})

export default router;