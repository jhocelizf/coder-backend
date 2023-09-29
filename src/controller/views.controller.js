import { cart_dao } from "../dao/index.js"
import ProductModel  from "../dao/mongo/models/product.model.js"
import { ProductsRepository } from "../dao/repository/product.repository.js"
import { product_dao } from "../dao/index.js"

const productsService = new ProductsRepository(product_dao)

async function showProducts(req, res) {
    try {
        if (process.env.PERSISTENCE === "MONGO") {
            const { limit = 10, page = 1, sort, query } = req.query
            const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await ProductModel.paginate(query ? { category: query } : {}, { limit, page, lean: true, sort: sort ? { price: 1 } : { price: -1 } })
            res.render("home", {
                title: "Productos",
                products: docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                limit,
                sort,
                query,
                script: "index.js",
                style: "style.css",
                nombre: req.user.user.first_name,
                apellido: req.user.user.last_name,
                email: req.user.user.email,
                rol: req.user.user.role,
                idCart: req.user.user.cart,
                PORT: process.env.PORT
            })
        } else {
            res.render("home", {
                title: "Productos",
                script: "index.js",
                style: "style.css",
                fullname: req.user.user.fullname,
                email: req.user.user.email,
                rol: req.user.user.role,
                idCart: req.user.user.cart,
                productos: await productsService.getProducts(req, res),
                PORT: process.env.PORT,
                MONGO: process.env.PERSISTENCE === "MONGO"
            })
        }
    } catch (err) {
        console.log(err)
    }
}

async function showRealTimeProducts(req, res) {
    try {
        res.render("realTimeProducts", { title: "Productos en tiempo real", script: "realTimeProducts.js", style: "realTimeProducts.css" })
    } catch (err) {
        console.log(err)
    }
}

async function showCart(req, res) {
    try {
        const { cid } = req.params;
        try {
            let carrito = await cart_dao.getCartById(cid)
            if (carrito) {
                let productos = carrito.products.map(p => p.product);
                if (productos.length === 0) {
                    res.send("El carrito está vacio")
                } else {
                    res.render("carrito", { title: "Carrito", productos, script: "carts.js", style: "style.css", MONGO: process.env.PERSISTENCE === "MONGO", purchaser: req.user.user.email, idC: req.user.user.cart });
                }
            } else {
                res.send("Carrito no encontrado");
            }
        } catch (err) {
            console.log(err);
            res.send("Error al cargar el carrito");
        }
    } catch (err) {
        console.log(err)
    }
}

export { showProducts, showRealTimeProducts, showCart } 