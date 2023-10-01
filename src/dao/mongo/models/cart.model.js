import mongoose from "mongoose";

const cartCollection = "carts";

const CartSchema = new mongoose.Schema({
    products : [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
        },
    ],
})

CartSchema.pre("findOne",function(next){
    this.populate("products.product")
    next()
})

// const CartModel = mongoose.model(cartCollection, CartSchema );


export const CartModel = mongoose.model(cartCollection, CartSchema);