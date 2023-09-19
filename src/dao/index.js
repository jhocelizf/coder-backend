//Clases locales
import productsLocal from "./memory/products.dao.js"
import cartsLocal from "./memory/cart.dao.js"

//Clases con mongo
import productMongo from "./mongo/product.dao.js"
import cartMongo from "./mongo/cart.dao.js"

export const PRODUCTS_DAO = process.env.PERSISTENCE === "MONGO" ?    new productsLocal() : new productMongo()
export const CARTS_DAO = process.env.PERSISTENCE === "MONGO" ?    new cartsLocal() : new cartMongo()