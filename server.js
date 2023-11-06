import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import db from "./Database/db.js";
import router from "./Router/index.js";
import fileUpload from 'express-fileupload'
dotenv.config()

const app = express();
const port = 8000;
app.use(express.static("public/files"))
app.use(express.json())
app.use(
    cors({
        origin: 'http://localhost:5173', // Ganti dengan alamat asal aplikasi React Anda
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // Mengizinkan kredensial (misalnya, dengan menggunakan cookie)
    })
);
app.use(cookieParser())
app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 } // Batas ukuran berkas: 10 MB
}));
app.use(express.static("public"));

try {
    await db.authenticate()
    console.log('database connected');
    // await db.sync();

} catch (error) {
    console.log(error);
}

app.use(router)

app.get('/', (req, res) => {
    res.send("hello world")
})

app.listen(port, () => {
    console.log(`running in port ${port}`);
})