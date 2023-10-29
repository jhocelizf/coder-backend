import nodemailer from "nodemailer"
import { configuration } from "../config/config.js"

configuration()

export const transport = nodemailer.createTransport({
    service: "gmail",
    port: 25,
    secure: true,
    auth: {
        user: process.env.MAILING_USER,
        pass: process.env.MAILING_PASSWORD
    }
})
transport.verify().then(() => {
    console.log("Ready for send emails")
})