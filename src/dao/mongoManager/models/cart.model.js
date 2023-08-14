import mongoose from "mongoose";

const cartModel = mongoose.model('carts', new mongoose.Schema({
    products: {
        type: [{
            product: String,
            quantity: Number
        }]
    }
}))

export default cartModel