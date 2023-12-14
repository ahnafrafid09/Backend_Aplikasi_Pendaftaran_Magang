import Express from "express";
import { Register } from "../Controller/Login/User.js";
import { refreshToken } from "../Controller/Login/RefreshToken.js";
import { Login, Logout } from "../Controller/Login/Auth.js";
import adminRoute from "./adminOnly.js";
import loginRoute from "./LoginRoute.js";

const router = Express.Router()
router.post("/api/register", Register)
router.post("/api/login", Login)
router.get("/api/token", refreshToken)
router.delete("/api/logout", Logout)

router.use('/api/admin', adminRoute)
router.use('/api/user', loginRoute)

export default router

