import express from "express";
import cors from "cors"
import db from "./Database/db.js";
import router from "./Router/index.js";



const app = express();
const port = 8000;
app.use (express.json())
app.use (cors())

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