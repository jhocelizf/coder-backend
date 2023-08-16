import { Router } from "express";
import { __filename, __dirname } from "../utils.js";
// import { obtenerListaDeProductos } from "../services/ProductManager.js";
import cartModel from "../dao/mongoManager/models/cart.model.js";
import ProductModel from "../dao/mongoManager/models/product.model.js"

const productRouter = Router();
/* 
productRouter.get("/", (req, res) => {
    const products = obtenerListaDeProductos();

    res.render("home", { products });
});
 */

productRouter.get("/",async (req,res)=>{
    const {limit = 10, page = 1, sort, query} = req.query
    const {docs,hasPrevPage,hasNextPage,nextPage,prevPage} = await ProductModel.paginate(query ? {category: query} : {},{limit, page, lean: true, sort: sort ? {price:1} : {price:-1}})
    res.render("home",{title: "products", 
    products: docs,  
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    limit,
    sort,
    query,
    script: "products.js"
})
})

export default productRouter;