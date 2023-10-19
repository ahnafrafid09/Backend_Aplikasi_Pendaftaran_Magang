import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import db from "./Database/db.js";
import router from "./Router/index.js";
dotenv.config()

const app = express();
const port = 8000;
app.use (express.json())
app.use (cors({credentials: true, origin: "http://127.0.0.1:5173"}))
app.use (cookieParser())

try {
    await db.authenticate()
    console.log('database connected');
    // await Users.sync();
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