import { Router } from "express";
// import { ProductManager } from "../services/ProductManager.js";
// import ProductModel from "../dao/mongoManager/models/product.model.js";
import { getProductos, getProductByID, modifyProducto, deleteProducto, saveProducto } from "../controller/products.controller.js"

const router = Router();
let products = [];

// 

//Tomar productos
router.get("/",getProductos)
//Tomar producto por id
router.get("/:pid",getProductByID)
//Modificar un producto
router.put("/:pid",modifyProducto)
//Borrar un producto
router.delete("/:pid",deleteProducto)
//Agregar un producto
router.post("/agregarProducto",saveProducto)

export default router;
