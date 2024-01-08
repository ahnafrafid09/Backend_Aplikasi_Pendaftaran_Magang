import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import db from "./Database/db.js";
import router from "./Router/index.js";
import fileUpload from 'express-fileupload'
import { startScheduler } from "./Controller/InstansiMagang.js";
dotenv.config()

const app = express();
const port = 8000;
app.use(express.static("public/files"))
app.use(express.json())
app.use(
    cors({
        origin: ['http://localhost:5173', 'http://192.168.0.22:5173'], // Ganti dengan alamat asal aplikasi React Anda
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // Mengizinkan kredensial (misalnya, dengan menggunakan cookie)
    })
);
app.use(cookieParser())
app.use(fileUpload());
app.use(express.static("public"));
startScheduler()

try {
    await db.authenticate()
    console.log('database connected');
    // await db.sync();
} catch (error) {
    console.log(error);
}

app.use(router)

app.get('/', (req, res) => {
    res.status(404).send("Selamat Datang Di Dalam API Magang Diskominfo")
})

app.listen(port, () => {
    console.log(`running in port ${port}`);
})