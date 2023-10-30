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
app.use(express.json())
app.use(cors({ credentials: true, origin: true }))
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