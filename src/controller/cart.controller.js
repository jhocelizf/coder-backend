import { cart_dao } from "../dao/index.js";
import { product_dao } from "../dao/index.js"
import Tickets from "../dao/fileManager/ticket.manager.js"
import { CustomErrors } from "../errors/customErrors.js";
import { Errors } from "../errors/errors.js";
import { logger } from "../dao/index.js";

const ticketManager = new Tickets();


async function crearCarrito(req, res) {
    req.logger = logger
    try {
        const cart = {
            products: []
        }
        const result = await cart_dao.saveCart(cart)
        res.json({ status: "Success", result })
    } catch (err) {
        const error = CustomErrors.generateError({
            name: "Cart Error",
            message: "Error create cart",
            cause: err,
            code: Errors.DATABASE_ERROR
        })
        req.logger.error("Error " + JSON.stringify(error) + " " + new Date().toDateString())
        res.json({ status: "error", error })
    }
}

async function getCarritoById(req, res) {
    req.logger = logger
    try {
        const { cid } = req.params
        let result = await cart_dao.getCartById(cid)
        res.json({ message: "Carrito seleccionado", result })
    } catch (err) {
        const error = CustomErrors.generateError({
            name: "Cart Error",
            message: "Error get cart",
            cause: err,
            code: Errors.DATABASE_ERROR
        })
        req.logger.error("Error " + JSON.stringify(error) + " " + new Date().toDateString())
        res.json({status: "error", error})
    }
}

async function saveProductInCart(req, res) {
    req.logger = logger
    try {
        const { cid, pid } = req.params;
        const result = await cart_dao.saveProductCart(cid, pid)
        res.json({ status: "Success", message: "Ok", result })
    } catch (err) {
        const error = CustomErrors.generateError({
            name: "Cart Error",
            message: "Error save product in cart",
            cause: err,
            code: Errors.DATABASE_ERROR
        })
        req.logger.error("Error " + JSON.stringify(error) + " " + new Date().toDateString())
        res.json({status: "error", error})
    }
}

async function updateCarrito(req, res) {
    req.logger = logger
    try {
        const { cid } = req.params
        const { data } = req.body
        const result = await cart_dao.updateCart(cid, data)
        res.status(201).json({ "message": "Carrito actualizado", result })
    } catch (err) {
        const error = CustomErrors.generateError({
            name: "Cart Error",
            message: "Error update cart",
            cause: err,
            code: Errors.DATABASE_ERROR
        })
        req.logger.error("Error " + JSON.stringify(error) + " " + new Date().toDateString())
        res.json({status: "error", error})
    }
}

async function updateQuantityProductsCarrito(req, res) {
    req.logger = logger
    try {
        const { cid, pid } = req.params
        const { cantidad } = req.body
        const result = await cart_dao.updateQuantityProductsCart(cid, pid, cantidad)
        res.send(result)
    } catch (err) {
        const error = CustomErrors.generateError({
            name: "Cart Error",
            message: "Error update quantity cart",
            cause: err,
            code: Errors.DATABASE_ERROR
        })
        req.logger.error("Error " + JSON.stringify(error) + " " + new Date().toDateString())
        res.json({status: "error", error})
    }
}

async function deleteProductsCarrito(req, res) {
    req.logger = logger
    try {
        const { cid } = req.params
        const result = await cart_dao.deleteProductsCart(cid)
        res.json({ status: result, message: "Ok" })
    } catch (err) {
        const error = CustomErrors.generateError({
            name: "Cart Error",
            message: "Error delete products in cart",
            cause: err,
            code: Errors.DATABASE_ERROR
        })
        req.logger.error("Error " + JSON.stringify(error) + " " + new Date().toDateString())
        res.json({status: "error", error})
    }
}

async function deleteProductCarrito(req, res) {
    req.logger = logger
    try {
        const { cid, pid } = req.params
        console.log(cid, pid)
        const result = await cart_dao.deleteProductCart(cid, pid)
        res.json({ status: result, message: "Ok" })
    } catch (err) {
        const error = CustomErrors.generateError({
            name: "Cart Error",
            message: "Error delete product in cart",
            cause: err,
            code: Errors.DATABASE_ERROR
        })
        req.logger.error("Error " + JSON.stringify(error) + " " + new Date().toDateString())
        res.json({status: "error", error})
    }
}

async function purchase(req, res) {
    req.logger = logger
    try {
        const { cartId, userId, noStockProduct, detailProducts } = req.body
        const cart = await cart_dao.getById(cartId)
        const user = await userManager.getById(userId)
        let amount = 0;
        if (detailProducts.length) {
            for (let i = 0; i < detailProducts.length; i++) {
                const productID = detailProducts[i].product._id;
                const product = await product_dao.getById(productID);
                const quantity = detailProducts[i].quantity;
                amount = amount + product.price * quantity;
                product.stock = product.stock - quantity;
                await product_dao.save(product);
            }
        } else {
            const productID = detailProducts[0].product._id;
            const product = await product_dao.getById(productID);
            const quantity = detailProducts[0].product.quantity;
            amount = amount + product.price * quantity;
            product.stock = product.stock - quantity;
            await product_dao.save(product);
        }



        const datetime = new Date()

        const purchase_datetime = datetime.toISOString().split('T')[0] + "-" + datetime.toLocaleTimeString();

        const purcharser = user.email

        const tickets = await ticketManager.getAll();


        let code = "";

        if (tickets.length >= 0) {
            const numberCode = tickets.length + 1

            code = "A " + numberCode
        } else {
            code = "A " + 1
        }
        const data = { code, purchase_datetime, amount, purcharser };

        if (amount > 0) {
            await ticketManager.save(data);

            await emptyCart(cartId);
            if (noStockProduct.length) {
                for (let i = 0; i < noStockProduct.length; i++) {
                    const productID = noStockProduct[i].product._id;
                    const quantity = noStockProduct[i].quantity;
                    cart.products.push({ id: productID, quantity: parseInt(quantity) })
                }
            } else {
                const productID = noStockProduct.product._id;
                const quantity = noStockProduct.quantity;
                cart.products.push({ id: productID, quantity: parseInt(quantity) })
            }
            await cart_dao.save(cart)
            const ticket = await ticketManager.getByCode(code)

            data.ticket = ticket._id

            res.status(200).json(data)
        } else {
            res.status(406).json("No se pudo completar la compra debido a falta de stock.")
        }

    } catch (error) {
        req.logger.error("Error " + JSON.stringify(error) + " " + new Date().toDateString())
    }
}

export { crearCarrito, getCarritoById, saveProductInCart, updateCarrito, updateQuantityProductsCarrito, deleteProductsCarrito, deleteProductCarrito, purchase }