import { Router } from "express";
import { __filename, __dirname } from "../utils.js";
// import { obtenerListaDeProductos } from "../services/ProductManager.js";
import CartModel from "../dao/mongoManager/models/cart.model.js";
import ProductModel from "../dao/mongoManager/models/product.model.js"

const productRouter = Router();
/* 
productRouter.get("/", (req, res) => {
    const products = obtenerListaDeProductos();

    res.render("home", { products });
});
 */

productRouter.get("/",async (req,res)=>{
    const cart = await CartModel.find()
    const cartId = cart ? cart[0]._id : null
    const {limit = 3, page = 1, sort, query} = req.query
    const {docs,hasPrevPage,hasNextPage,nextPage,prevPage} = await ProductModel.paginate(query ? {category: query} : {},{limit, page, lean: true, sort: sort ? {price:1} : {price:-1}})
    res.render("home",{title: "products", cartId,
    products: docs,  
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    limit,
    sort,
    query,
    script: "products.js",
    nombre: req.user.user.first_name,
    apellido: req.user.user.last_name,
    email: req.user.user.email,
    rol: req.user.user.role
})
})

productRouter.get("/carts/:cid",async(req,res)=>{
    const { cid } = req.params;
    try {
        let carrito = await CartsModel.findOne({_id: cid }).lean()
        if (carrito) {
            let productos = carrito.products;
            if(productos.length === 0){
                res.send("El carrito está vacio")
            }else{
                res.render("carrito", { title: "Carrito", productos, script: "carrito.js", style: "carrito.css"});
            }
        } else {
            res.send("Carrito no encontrado");
        }
    } catch (err) { 
        console.log(err); 
        res.send("Error al cargar el carrito");
    }
})


export default productRouter;