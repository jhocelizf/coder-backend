import express from "express";
import mongoose from "mongoose";
import productRouter from "./router/products.router.js";
import cartRouter from "./router/cart.router.js";
import viewsRouter from "./router/views.router.js";
// import realtimeRouter from "./router/realTimeProduct.router.js";
import chatRouter from "./router/chat.router.js";
import loginRouter from "./router/login.router.js";
import signupRouter from "./router/signup.router.js";
import sessionRouter from "./router/session.router.js";
import forgotRouter from "./router/forgot.router.js";
import ticketRouter from "./router/ticket.router.js"
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { __filename, __dirname, authToken } from "./utils.js";
import dotenv from "dotenv";
import MessageModel from "./dao/mongo/models/message.model.js";
import ProductModel from "./dao/mongo/models/product.model.js";
import MongoStore from "connect-mongo";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import intializePassport from "./config/passport.config.js"
import { configuration } from "./config/config.js"
import { Command } from "commander";
import { message_dao } from "./dao/index.js";
import { product_dao } from "./dao/index.js";
import { ProductsRepository } from "./dao/repository/product.repository.js";
import { ChatRepository } from "./dao/repository/chat.repository.js";
import compression from "express-compression"; 
import { loggerRouter } from "./Routes/logger.router.js"


configuration()
// Inicializar express
const app = express();

//Compresión de archivos
app.use(compression({
    brotli: {enabled: true,zlib:{}}
}))

app.use(cookieParser("C0D3RS3CR3T"));

const PORT = process.env.PORT 
const MONGO_URI = process.env.MONGO_URI;
const ENVIRONMENT = process.env.ENVIRONMENT 

//Inicializar el servidor con socket
const httpServer = app.listen(PORT,()=>{
    console.log(`El servidor esta corriendo en el puerto ${PORT} en modo ${ENVIRONMENT}`) 
})

httpServer.on("error",(err)=>{
    console.log(err)
})

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(
    () => {
        console.log('Conexion a la base de datos establecida');
    },
    (error) => {
        console.log("Error en la conexion a la base de datos", error);
    }
);

app.use(
    session({
        store: MongoStore.create({
            mongoUrl: MONGO_URI,
            mongoOptions: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
            ttl: 30,
        }),
        secret: "codersecret",
        resave: false,
        saveUninitialized: false,
    })
);

//Passport
intializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/home", authToken, viewsRouter);
app.use("/chat", authToken, chatRouter);
app.use("/", loginRouter);
app.use("/signup", signupRouter);
app.use("/forgot", forgotRouter);
app.use("/api/session/", sessionRouter);
app.use("/api/tickets/", ticketRouter);
app.use("/loggerTest",loggerRouter);


const io = new Server(httpServer);
const productsService = new ProductsRepository(product_dao)
const chatService = new ChatRepository(message_dao)

//Conectarse
io.on("connection", async (socket) => {
    console.log("Nueva conexión establecida");

    //Desconectarse
    socket.on("disconnect", () => {
        console.log("Usuario desconectado")
    })

    //Se suma un nuevo producto en realTime
    socket.on("new-product", async (data) => {
        const newProduct = await productsService.saveProduct(data)
        //Se muestran los productos realTime
        const productos = process.env.PORT === "8080" ? await ProductModel.find({}).lean({}) : await productsService.getProducts()
        socket.emit("update-products", productos)
    });

    //Se borra un producto en realTime 
    socket.on("delete-product", async (data) => {
        let id = data;
        let result = await productsService.deleteProduct(id);
        console.log("Producto eliminado", result);
        //Se muestran los productos realTime
        const productos = process.env.PORT === "8080" ? await ProductModel.find({}).lean({}) : await productsService.getProducts()
        socket.emit("update-products", productos)
    })

    //Se muestran los productos realTime
    const productos = process.env.PORT === "8080" ? await ProductModel.find({}).lean({}) : await productsService.getProducts()
    socket.emit("update-products", productos)


    /****/

    //Crear mensaje
    socket.on("guardar-mensaje", async (data) => {
        await chatService.createMessage(data)
        const mensajes = await chatService.getMessages()
        socket.emit("enviar-mensajes", mensajes)
    })

    //Mostar mensajes
    const mensajes = await chatService.getMessages()
    socket.emit("enviar-mensajes", mensajes)

    //Recibir cantidad de mensajes
    socket.on("Nuevos-mensajes", async (data) => {
        //Mostar mensajes
        const mensajes = await chatService.getMessages()
        socket.emit("enviar-mensajes", mensajes)
    })
});