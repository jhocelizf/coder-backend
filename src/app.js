import express from "express";
import productRouter from "./router/products.router.js";
import cartRouter from "./router/carts.router.js";
import viewsRouter from "./router/views.router.js";
import realtimeRouter from "./router/realTimeProduct.router.js";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { __filename, __dirname } from "./utils.js";
import { guardarProducto } from "./services/productUtils.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);
app.use("/realtime", realtimeRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto ${PORT}`);
});

httpServer.on("error", (err) => {
    console.log(err);
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    // Manejar eventos personalizados
    socket.on("mensaje", (data) => {
        console.log("Mensaje recibido:", data);

        // Enviar una respuesta al cliente
        socket.emit("respuesta", "Mensaje recibido correctamente");
    });

    // Escuchar evento 'agregarProducto' y emitir 'nuevoProductoAgregado'
    socket.on("agregarProducto", (newProduct) => {
        console.log("Nuevo producto recibido backend:", newProduct);
        guardarProducto(newProduct);
        // Agregar el nuevo producto a la lista de productos
        io.emit("nuevoProductoAgregado", newProduct);
    });

    socket.on("productoEliminado", (productID) => {
      // Eliminar el producto de la lista en el cliente
    const productoElement = document.querySelector(`[data-id="${productID}"]`);
    if (productoElement) {
        productoElement.parentElement.remove();
    }
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});




