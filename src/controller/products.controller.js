import { product_dao } from "../dao/index.js";
import passport from "passport";
import { faker } from "@faker-js/faker";
import { generateUserErrorInfo } from "../errors/info.js";
import { CustomErrors } from "../errors/customErrors.js";
import { Errors } from "../errors/errors.js"

async function getProductos(req, res) {
    try {
        const result = await product_dao.getProducts(req, res)
        res.send(result)
    } catch (err) {
        const error = CustomErrors.generateError({
            name: "Products Error",
            message: "Error get products",
            cause: err,
            code: Errors.DATABASE_ERROR
        })
        console.log(error)
        res.json({status: "error", error})
    }
}

async function getProductByID(req, res) {
    try {
        const { pid } = req.params
        const producto = await product_dao.getProductById(pid)
        res.json({ message: "Producto seleccionado", producto: producto })
    } catch (err) {
        const error = CustomErrors.generateError({
            name: "Product Error",
            message: "Error get product",
            cause: err,
            code: Errors.DATABASE_ERROR
        })
        console.log(error)
        res.json({status: "error", error})
    }
}

async function modifyProducto(req, res) {
    try {
        const { pid } = req.params
        const { title, description, code, price, stock, category, image, } = req.body
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(500).json({message : "Faltan datos"})
            const error = CustomErrors.generateError({
                name: "Faltan datos",
                message: "Invalid types",
                cause: generateUserErrorInfo({title,description,code,price,stock,category, image}),
                code: Errors.INCOMPLETE_DATA
            })
            console.log(error)
            res.json({status: "error", error})
        }  if (!image) {
            req.body.thumbnail = "";
        }
            else {
            const producto = {
                title: title,
                description: description,
                code: code,
                price: +price,
                status: true,
                stock: +stock,
                category: category,
                image: image
            }
            const data = await product_dao.modifyProduct(producto, pid)
            res.json({ message: "Producto modificado correctamente", data })
        }
    } catch (err) {
        const error = CustomErrors.generateError({
            name: "Products Error",
            message: "Error modify product",
            cause: err,
            code: Errors.DATABASE_ERROR
        })
        console.log(error)
        res.json({status: "error", error})
    }
}

async function deleteProducto(req, res) {
    try {
        const { pid } = req.params
        const data = await product_dao.deleteProduct(pid)
        res.send(data)
    } catch (err) {
        const error = CustomErrors.generateError({
            name: "Products Error",
            message: "Error delete product",
            cause: err,
            code: Errors.DATABASE_ERROR
        })
        console.log(error)
        res.json({status: "error", error})
    }
}

async function saveProducto(req, res) {
    try {
        const { title, description, code, price, stock, category, image, } = req.body
        if (!title || !description || !code || !price || !stock || !category) {
            const error = CustomErrors.generateError({
                name: "Faltan datos",
                message: "Invalid types",
                cause: generateUserErrorInfo({title,description,code,price,stock,category,thumbnail}),
                code: Errors.INCOMPLETE_DATA
            })
            console.log(error)
            res.json({status: "error", error})
        } if (!image) {
            req.body.thumbnail = "";
        }
        else {
            const productoNuevo = {
                title,
                description,
                code,
                price: +price,
                status: true,
                stock: +stock,
                category,
                image,
                quantity: 1
            }
            console.log(productoNuevo)
            const data = await PRODUCTS_DAO.saveProduct(productoNuevo)
            res.status(201).json({ message: "Producto agregado exitosamente", status: data })
        }
    } catch (err) {
        const error = CustomErrors.generateError({
            name: "Products Error",
            message: "Error save product",
            cause: err,
            code: Errors.DATABASE_ERROR
        })
        console.log(error)
        res.json({status: "error", error})
    }
}
async function createProducts(req,res){
    try{
        for(let i = 0; i<100; i++){
            const newProductRandom = {
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                code: faker.string.alphanumeric(),
                price: faker.commerce.price(),
                status: faker.datatype.boolean(),
                stock: +faker.string.numeric(),
                category: faker.commerce.product(),
                thumbnail: faker.image.url(),
                quantity: 1
            }
            const response = await productsService.saveProduct(newProductRandom)
            console.log(response)
        }
        res.json({status: "Success", message: "All products inserted"})
    }catch(err){
        const error = CustomErrors.generateError({
            name: "Products Error",
            message: "Error create products",
            cause: err,
            code: Errors.DATABASE_ERROR
        })
        console.log(error)
        res.json({status: "error", error})
    }
}

export { getProductos, getProductByID, modifyProducto, deleteProducto, saveProducto, createProducts }