import { Router } from "express";
import { __filename, __dirname } from "../utils.js";
// import CartModel from "../dao/mongoManager/models/cart.model.js";
// import ProductModel from "../dao/mongoManager/models/product.model.js"
import { showProducts, showRealTimeProducts, showCart } from "../controller/views.controller.js"

const productRouter = Router();

productRouter.get("/",showProducts)

productRouter.get("/realTimeProducts",showRealTimeProducts)

productRouter.get("/carts/:cid",showCart)


export default productRouter;