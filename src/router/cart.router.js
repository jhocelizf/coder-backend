import { Router } from "express";
// import ProductModel from "../dao/mongoManager/models/product.model.js";
// import CartModel from "../dao/mongoManager/models/cart.model.js";
import { crearCarrito, getCarritoById, saveProductInCart, updateCarrito, updateQuantityProductsCarrito, deleteProductsCarrito, deleteProductCarrito} from "../controller/cart.controller.js"
const router = Router();

// const carts = new Carts();

// router.post("/", async (req, res) => {
//     try {
//         await CartModel.create({});
//         res.send({
//             status: "Success",
//             message: "el carrito se añadio correctamente",
//         });
//     } catch (err) {
//         res.send(` ${err}`);
//     }
// });
// crea carrito
router.post("/",crearCarrito)

// router.get("/:cid", async (req, res) => {
//     let { cid } = req.params;
//     try {
//         // Obtener un carrito por su ID
//         let cart = await CartModel.findById(cid);
//         if (!cart) {
//             // Si el carrito no se encuentra, puedes enviar un mensaje de error
//             return res.status(404).render("error", { message: "Carrito no encontrado" });
//         }

//         // Renderizar la plantilla y pasarle los datos del carrito
//         res.render("cart", { title: "Cart", cart });
//     } catch (error) {
//         console.error(error);
//         res.status(500).render("error", { message: "Ocurrió un error al procesar la solicitud" });
//     }
// });


// // Aca use el req.body
// router.post("/:cid/product/:pid", async (req, res) => {
//     const { cid, pid } = req.params;
//     const { quantity } = req.body;

//     let cart = await CartModel.findOne({ _id: cid });
//     if (cart) {
//         const productoEnCarrito = cart.products.find(e => e.product === pid);

//         if (productoEnCarrito) {
//             if (quantity) {
//                 productoEnCarrito.quantity += quantity; // Incrementa la cantidad según lo proporcionado
//             } else {
//                 productoEnCarrito.quantity++; // Incrementa en 1 si no se proporciona quantity
//             }
//         } else {
//             const product = await ProductModel.findById(pid);
//             const newProduct = {
//                 product: product._id,
//                 quantity: quantity || 1 // Usa quantity si se proporciona, de lo contrario, usa 1
//             };
//             cart.products.push(newProduct);
//         }

//         const result = await cart.save();
//         return res.json({ message: "Producto agregado", data: result });
//     } else {
//         return res.status(404).json({ message: "Carrito no encontrado" });
//     }
// })

// router.post("/:cid/products", async (req, res) => {
//     try {
//         const {cid}  = req.params;
//         const { productsToAdd }= req.body;

//         const cart = await CartModel.findById(cid);

//         for (const productToAdd of productsToAdd) {
//             const existingProductIndex = cart.products.findIndex(e => e.item.toString() === productToAdd.item);

//             if (existingProductIndex !== -1) {
//                 cart.products[existingProductIndex].quantity += productToAdd.quantity;
//             } else {
//                 cart.products.push({ item: productToAdd.item, quantity: productToAdd.quantity });
//             }
//         }
//         const updatedCart = await cart.save();
        
//         res.json(updatedCart);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// router.put("/:cid/products/:pid", async (req, res) => {
//     const { cid, pid } = req.params
//     const { quantity } = req.body
//     let cart = await CartModel.findOne({ _id: cid })
//     let productos = cart.products
//     let producto = productos.findIndex((producto) => producto.product.id === pid)
//     if (producto !== -1) {
//         productos[producto].product.quantity = quantity
//         let result = await CartModel.findByIdAndUpdate(cid, cart)
//         return res.json({ message: "Cantidad de ejemplares actualizada", data: result })
//     } else {
//         return res.status(404).json({ message: "Producto no encontrado" })
//     }
// });

// router.delete("/:cid", async (req, res) => {
//     const { cid } = req.params
//     let cart = await CartModel.findById(cid)
//     cart.products = []
//     let result = await CartModel.findByIdAndUpdate(cid, cart)
//     return res.json({ message: "Carrito vacio", data: result })
// })

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

export default router;