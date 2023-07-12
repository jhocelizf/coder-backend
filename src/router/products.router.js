import { Router } from "express";
import { ProductManager } from "../models/ProductManager.js";

const router = Router();
let products = [];
const productManager = new ProductManager("products.json");


router.get("/", async (req, res) => {
    const { limit } = req.query;
    try {
        const resultProducts = await productManager.getProducts();
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

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;

    let product = await productManager.getProductById(pid);

    if (product) {
        res.json({ message: "listo", data: product });
    } else {
        res.json({
            message: "el producto no existe",
        });
    }
});

router.post("/", async (req, res) => {
    const { title, description, code, price, stock, category, thumbnail,
    } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(401).json({ message: "faltan datos" });
    }
    if (!thumbnail) {
        req.body.thumbnail = "";
    }
    try {
        const response = await productManager.addProduct(req.body);
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

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    } = req.body;
    const productTemp = {};
    let product = await productManager.getProductById(pid);

    if (product) {
        ///actualizar
        if (
            (!title,
                !description,
                !code,
                !price,
                !status,
                !stock,
                !category,
                !thumbnails)
        ) {
            res.json({ message: "faltan datos" });
        }
        productTemp.title = title;
        productTemp.description = description;
        productTemp.code = code;
        productTemp.price = price;
        productTemp.status = status;
        productTemp.stock = stock;
        productTemp.category = category;
        productTemp.thumbnails = thumbnails;

        //actualizamos el producto en el archivo
        let result = await productManager.updateProductById((pid),
            productTemp
        );

        res.json({ message: "producto actualizado", result });
    } else {
        res.json({
            message: "el producto solicitado no existe, no se puede actualizar",
        });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        // Eliminar un producto por su ID
        const pid = req.params.pid;
        await productManager.deleteProductById(pid);
        res.send({ status: "Success", message: `Producto eliminado con éxito!` });
    } catch (error) {
        res
            .status(400)
            .send({ status: "Error", message: "Error al eliminar un producto" });
    }
});

export default router;
