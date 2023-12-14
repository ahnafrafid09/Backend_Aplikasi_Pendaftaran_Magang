import Express from "express";
import { verifyToken } from "../Middleware/VerifToken.js";
import { updatePassword, updateEmail } from "../Controller/Login/User.js";
import { getInstansiByUserId, daftar } from "../Controller/Daftar/Daftar.js";
import { getDaftarbyId } from "../Controller/Daftar/Daftar.js";

const loginRoute = Express.Router()

loginRoute.get('/instansi/user', verifyToken, getInstansiByUserId)
loginRoute.get('/daftar/:instansiId', verifyToken, getDaftarbyId)
loginRoute.post('/daftar', verifyToken, daftar)
loginRoute.patch("/user/:id/change-password", verifyToken, updatePassword)
loginRoute.patch("/user/:id/change-email", verifyToken, updateEmail)

export default loginRoute