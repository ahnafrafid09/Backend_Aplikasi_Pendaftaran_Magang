import { Express } from "express";
import { getUsers } from "../Controller/Login/User.js";

const router = Express.Router()

router.get("/users", getUsers)

export default router

