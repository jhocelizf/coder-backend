import { Router } from "express";
// import ProductModel from "../dao/mongoManager/models/product.model.js";
// import CartModel from "../dao/mongoManager/models/cart.model.js";
import { crearCarrito, getCarritoById, saveProductInCart, updateCarrito, updateQuantityProductsCarrito, deleteProductsCarrito, deleteProductCarrito, purchaseProducts} from "../controller/cart.controller.js"

const router = Router();

// crea carrito
router.post("/",crearCarrito)

//Tomar carrito por id
router.get("/:cid",getCarritoById)
//Tomar carrito por id y sumarle un producto
router.post("/:cid/product/:pid",saveProductInCart)

//Eliminar del carrito el producto seleccionado
router.delete("/:cid/products/:pid",deleteProductCarrito)

//Actualizar el carrito con un arreglo de productos especificado
router.put("/:cid",updateCarrito)

//Actualizar cantidad de ejemplares del producto seleccionado, del carrito especificado
router.put("/:cid/products/:pid",updateQuantityProductsCarrito)

//Eliminar todos los productos del carrito
router.delete("/:cid",deleteProductsCarrito)

// Comprar productos del carrito y generar orden
router.post("/:cid/purchase",purchaseProducts)

export default router;