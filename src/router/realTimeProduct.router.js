import { Router } from "express";
import { __filename, __dirname } from "../utils.js";
/* import {
    obtenerListaDeProductos,
} from "../services/ProductManager.js"; */


const realtimeRouter = Router();

realtimeRouter.get("/", (req, res) => {
const products = obtenerListaDeProductos();
// console.log(products);
res.render("realTimeProducts", { products });
});

export default realtimeRouter;