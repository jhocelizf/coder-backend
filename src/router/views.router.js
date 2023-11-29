import { Router } from "express";
import { __filename, __dirname } from "../utils.js";
import { showProducts, showRealTimeProducts, showCart, showUsers  } from "../controller/views.controller.js"
import { authAdmin, authOnlyAdmin } from "../utils.js";

const productRouter = Router();

productRouter.get("/",showProducts)

productRouter.get("/realTimeProducts",authAdmin,showRealTimeProducts)

productRouter.get("/carts/:cid",showCart)

productRouter.get("/users",authOnlyAdmin,showUsers)


export default productRouter;