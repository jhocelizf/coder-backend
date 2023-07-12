import express from "express";
import productRouter from "./router/products.router.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("hola mundo");
});

app.use("/api/products", productRouter);

app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto ${PORT}`);
});



