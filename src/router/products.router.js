import { Router } from "express";
// import { ProductManager } from "../services/ProductManager.js";
// import ProductModel from "../dao/mongoManager/models/product.model.js";
import { getProductos, getProductByID, modifyProducto, deleteProduct, saveProducto, createProducts } from "../controller/products.controller.js"

const router = Router();
let products = [];

//Tomar productos
router.get("/",getProductos)
//Tomar producto por id
router.get("/:pid",getProductByID)
//Modificar un producto
router.put("/:pid",modifyProducto)
//Borrar un producto
router.delete("/:pid",deleteProduct) 
//Agregar un producto
router.post("/agregarProducto",saveProducto)
//Crear productos
router.post("/mockingproducts",createProducts)


export default router;
