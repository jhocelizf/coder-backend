import CartModel from "./models/cart.model.js";
import ProductModel from "./models/product.model.js";

export default class CarritoDao {

    async getCarts() {
        try {
            return await CartModel.find({})
        } catch (err) {
            console.log(err)
        }
    }

    async getCartById(id) {
        try {
            return await CartModel.findById(id).lean({})
        } catch (err) {
            console.log(err)
        }
    }

    async saveCart(cart) {
        try {
            return await CartModel.create(cart)
        } catch (err) {
            console.log(err)
        }
    }

    async saveProductCart(id, pid) {
        try {
            let carrito = await CartModel.findById(id)
            const productoEnCarrito = carrito.products.find(product => product.product.id == pid);
            if (carrito) {
                if (productoEnCarrito) {
                    const product = await ProductModel.findById(pid)
                    product.quantity++
                    let result = await product.save()
                    return "Success"
                } else {
                    const product = await ProductModel.findById(pid)
                    product.quantity = 1
                    let result = await product.save()
                    carrito.products.push({
                        product: product.id,
                    });
                }
                const result = await carrito.save();
                return "Success"
            } else {
                return "Cart not found";
            }
        } catch (err) {
            console.log(err)
        }
    }

    async deleteProductCart(cid, pid) {
        try {
            const carrito = await CartModel.findById(cid)
            const indexProduct = carrito.products.findIndex(p => p.product.id == pid)
            if (indexProduct !== -1) {
                carrito.products.splice(indexProduct, 1)
                await carrito.save()
                return "Success"
            } else {
                return "Cart not found"
            }
        } catch (err) {
            console.log(err)
        }
    }

    async updateCart(id, data) {
        try {
            const carrito = await CartModel.findById(id)
            if (carrito) {
                carrito.products = data
                carrito.save()
                return "Success"
            } else {
                return "Cart not found"
            }
        } catch (err) {
            console.log(err)
        }
    }

    async updateQuantityProductsCart(cid, pid, cantidad) {
        try {
            const carrito = await CartModel.findById(cid)
            const productoEnCarrito = carrito.products.findIndex(c => c.product.id == pid)
            if (carrito) {
                if (productoEnCarrito !== -1) {
                    const product = await ProductModel.findById(pid)
                    product.quantity = cantidad
                    await product.save()
                    return "Success"
                } else {
                    return "Product not found"
                }
            } else {
                return "Cart not found"
            }
        } catch (err) {
            console.log(err)
        }
    }

    async deleteProductsCart(cid) {
        try {
            const carrito = await CartModel.findById(cid)
            if (carrito) {
                carrito.products = []
                await carrito.save()
                return "Success"
            } else {
                return "Cart not found"
            }
        } catch (err) {
            console.log(err)
        }
    }
}