import ProductModel from "./models/product.model.js";

export default class ProductsDao {

    async getProducts(req, res) {
        try {
            const { limit = 10, page = 1, sort, query } = req.query
            const results = await ProductModel.paginate(query ? { category: query } : {}, { limit, page, lean: true, sort: sort ? { price: 1 } : { price: -1 } })
            let prevLink = results.hasPrevPage ? `http://localhost:8080/productos/?page=${+page - 1}&limit=${limit}&query=${query}&sort=${sort}` : null
            let nextLink = results.hasNextPage ? `http://localhost:8080/productos/?page=${+page + 1}&limit=${limit}&query=${query}&sort=${sort}` : null
            results.prevLink = prevLink
            results.nextLink = nextLink
            return results
        } catch (err) {
            console.log(err)
        }
    }

    async getProductById(id) {
        try {
            return await ProductModel.findById(id)
        } catch (err) {
            console.log(err)
        }
    }

    async saveProduct(product) {
        try {
            console.log(product)
            let result = await ProductModel.create(product)
            return "Success"
        } catch (err) {
            console.log(err)
        }
    }

    async modifyProduct(product, id) {
        try {
            let result = await ProductModel.findByIdAndUpdate(id, product)
            return result
        } catch (err) {
            console.log(err)
        }
    }

    async deleteProduct(id) {
        try {
            let product = await ProductModel.findById(id)
            if (product) {
                return await ProductModel.findByIdAndDelete(id)
            } else {
                return "Product not found"
            }
        } catch (err) {
            console.log(err)
        }
    }
}