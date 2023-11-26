import { Router } from "express";
import { createOrder, captureOrder, cancelOrder } from "../controller/payment.controller.js";

const paymentsRouter = Router()

paymentsRouter.post("/create-order", createOrder);
paymentsRouter.get("/capture-order",captureOrder)
paymentsRouter.get("/cancel-order",cancelOrder)

export {paymentsRouter}