import { cart_dao } from "../dao/index.js";
import { product_dao } from "../dao/index.js"
import Tickets from "../dao/fileManager/ticket.manager.js"
import { CustomErrors } from "../errors/customErrors.js";
import { Errors } from "../errors/errors.js";
import { logger } from "../dao/index.js";
import { configuration } from "../config/config.js";
import axios from "axios"

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
        res.json({ status: "error", error })
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
        res.json({ status: "error", error })
    }
}

async function updateCarrito(req, res) {
    req.logger = logger
    try {
        const { cid } = req.params
        const { data } = req.body
        const result = await cart_dao.updateCart(cid, data)
        res.status(200).json({ "message": "Carrito actualizado", result })
    } catch (err) {
        const error = CustomErrors.generateError({
            name: "Cart Error",
            message: "Error update cart",
            cause: err,
            code: Errors.DATABASE_ERROR
        })
        req.logger.error("Error " + JSON.stringify(error) + " " + new Date().toDateString())
        res.json({ status: "error", error })
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
        res.json({ status: "error", error })
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
        res.json({ status: "error", error })
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
        res.json({ status: "error", error })
    }
}

async function purchaseProducts(req, res) {
    const { totalAmount, email, code } = req.body
    try {
        const order = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: totalAmount.toString(),
                    },
                },
            ],
            application_context: {
                brand_name: "ecommerce.com",
                landing_page: "NO_PREFERENCE",
                user_action: "PAY_NOW",
                return_url: `http://localhost:8080/capture-order`,
                cancel_url: `http://localhost:8080/cancel-order`,
            },
        };

        // format the body
        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");

        // Generate an access token
        const {
            data: { access_token },
        } = await axios.post(
            "https://api-m.sandbox.paypal.com/v1/oauth2/token",
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                auth: {
                    username: process.env.PAYPAL_API_CLIENT,
                    password: process.env.PAYPAL_API_KEY,
                },
            }
        );

        // make a request
        const response = await axios.post(
            `${process.env.PAYPAL_API}/v2/checkout/orders`,
            order,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        const newTicket = {
            code,
            purchase_datetime: new Date(),
            amount: totalAmount,
            purchaser: email
        }
        await TICKET_DAO.saveTicket(newTicket)

        res.json(response.data)
    } catch (err) {
        console.log(err)
        res.json({ message: "Something goes wrong" })
    }
}


export { crearCarrito, getCarritoById, saveProductInCart, updateCarrito, updateQuantityProductsCarrito, deleteProductsCarrito, deleteProductCarrito, purchaseProducts }