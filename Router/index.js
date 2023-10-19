import  Express  from "express";
import { verifyToken } from "../Middleware/VerifToken.js";
import { getUsers, Register, Login, Logout, updateUser, deleteUser} from "../Controller/Login/User.js";
import { refreshToken } from "../Controller/Login/RefreshToken.js";

const router = Express.Router()

router.get("/api/users", verifyToken, getUsers)
router.patch("/api/users/:id", verifyToken, updateUser)
router.delete("/api/users/:id", verifyToken, deleteUser)
router.post("/api/register", Register)
router.post("/api/login", Login)
router.get("/api/token", refreshToken)
router.delete("/api/logout", Logout)

export default router

