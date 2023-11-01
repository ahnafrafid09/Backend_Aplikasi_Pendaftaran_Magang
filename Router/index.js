import Express from "express";
import { verifyToken } from "../Middleware/VerifToken.js";
import { getUsers, Register, updateUser, deleteUser } from "../Controller/Login/User.js";
import { refreshToken } from "../Controller/Login/RefreshToken.js";
import { daftar, hapusDaftar, getDaftarbyId, editDaftar, getDaftar, getDaftarbyMenunggu, getDaftarbyDiterima } from "../Controller/Daftar.js";
import { deleteInstansi, getInstansi, getInstansibyId } from "../Controller/Instansi.js";
import { Login, Logout } from "../Controller/Login/Auth.js";

const router = Express.Router()
// API Login dan User
router.get("/api/users", getUsers)
router.patch("/api/users/:id", updateUser)
router.delete("/api/users/:id", deleteUser)
router.post("/api/register", Register)
router.post("/api/login", Login)
router.get("/api/token", refreshToken)
router.delete("/api/logout", Logout)

// API daftar
router.get('/api/daftar', getDaftar)
router.get('/api/daftar/menunggu', getDaftarbyMenunggu)
router.get('/api/daftar/terima', getDaftarbyDiterima)
router.get('/api/daftar/:id', getDaftarbyId)
router.post('/api/daftar', daftar)
router.patch('/api/daftar/:id', editDaftar)
router.delete('/api/daftar/:id', hapusDaftar)

// API instansi
router.get('/api/instansi', getInstansi)
router.get('/api/instansi/:id', getInstansibyId)
router.delete('/api/instansi/:id', deleteInstansi)


export default router

