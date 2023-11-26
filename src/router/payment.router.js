import { Router } from "express";
import { captureOrder, cancelOrder } from "../controller/payment.controller.js";

const paymentsRouter = Router()

paymentsRouter.get("/capture-order",captureOrder)
paymentsRouter.get("/cancel-order",cancelOrder)

export {paymentsRouter}