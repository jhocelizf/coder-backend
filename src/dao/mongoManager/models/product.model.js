import mongoose from "mongoose";

const productCollection = "products";

const ProductSchema = new mongoose.Schema({
        title: String,
        description: String,
        code: { type: Number, unique: true }, 
        price: Number,
        stock: Number,
        category: String,
        image: String ,
})

const ProductModel = mongoose.model(productCollection, ProductSchema );


export default ProductModel;