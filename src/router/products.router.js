import { Router } from "express";
// import { ProductManager } from "../services/ProductManager.js";
import ProductModel from "../dao/mongoManager/models/product.model.js";


const router = Router();
let products = [];
// const productManager = new ProductManager("products.json");

// router.get("/", async (res, req) => {
//     try{
//         const result = await ProductModel.find();
//         res.json({
//             data: result,
//             message: result.length ? "Hay productos" : "No hay productos",
//         });
//     } catch (error) {}
// });


// sirve
router.get('/', async (req, res) => {
    const result = await ProductModel.find()
    res.send(result)
})


router.get("/", async (req, res) => {
    const { limit } = req.query;
    try {
        // const resultProducts = await productManager.getProducts();
        const resultProducts = await ProductModel.getProducts();
        if (limit) {
            let tempArray = resultProducts.filter((dat, index) => index < limit);

            res.json({ data: tempArray, limit: limit, quantity: tempArray.length });
        } else {
            res.json({ data: resultProducts, limit: false, quantity: resultProducts.length });
        }
    } catch (err) {
        console.log(err);
    }
});

// esto sirve, se pone asi http://localhost:8080/api/products/64cd0837e8f032c3cd11d553
router.get("/:pid", async (req, res) => {
    const { pid } = req.params;

    // let product = await productManager.getProductById(pid);
    let product = await ProductModel.find(pid);

    if (product) {
        res.json({ message: "listo", data: product });
    } else {
        res.json({
            message: "el producto no existe",
        });
    }
});

// esto sirve
router.post("/", async (req, res) => {
    const { title, description, code, price, stock, category, image,
    } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(401).json({ message: "faltan datos" });
    }
    if (!image) {
        req.body.thumbnail = "";
    }
    try {
        const response = await ProductModel.create(req.body);
        res.json({
            message: "producto agregado",
            data: response,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "error interno del servidor",
        });
    }
});

// funciona
router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const {
        title,
        description,
        code,
        price,
        stock,
        category,
        image,
    } = req.body;
    const productTemp = {};
    // let product = await productManager.getProductById(pid);
    let product = await ProductModel.findByIdAndUpdate(pid);

    if (product) {
        ///actualizar
        if (
            (!title,
                !description,
                !code,
                !price,
                !stock,
                !category,
                !image)
        ) {
            res.json({ message: "faltan datos" });
        }
        productTemp.title = title;
        productTemp.description = description;
        productTemp.code = code;
        productTemp.price = price;
        productTemp.stock = stock;
        productTemp.category = category;
        productTemp.image = image;

        //actualizamos el producto en el archivo
        let result = await ProductModel.findByIdAndUpdate((pid),
            productTemp
        );

        res.json({ message: "producto actualizado", result });
    } else {
        res.json({
            message: "el producto solicitado no existe, no se puede actualizar",
        });
    }
});

// este sirve
router.delete("/:pid", async (req, res) => {
    try {
        // Eliminar un producto por su ID
        const pid = req.params.pid;
        await ProductModel.findByIdAndDelete(pid);
        res.send({ status: "Success", message: `Producto eliminado con éxito!` });
    } catch (error) {
        res
            .status(400)
            .send({ status: "Error", message: "Error al eliminar un producto" });
    }
});

export default router;
