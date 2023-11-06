import Express, { application } from "express";
import { verifyToken } from "../Middleware/VerifToken.js";
import { getUsers, Register, updateUser, deleteUser } from "../Controller/Login/User.js";
import { refreshToken } from "../Controller/Login/RefreshToken.js";
<<<<<<< HEAD
import { daftar, hapusDaftar, getDaftarbyId, getDaftar, getDaftarbyMenunggu, getDaftarbyDiterima, pelamarData } from "../Controller/Daftar.js";
import { deleteInstansi, getInstansi, getInstansibyId } from "../Controller/Instansi.js";
=======
import { daftar, hapusDaftar, getDaftarbyId, editDaftar, getDaftar, getDaftarbyMenunggu, getDaftarbyDiterima} from "../Controller/Daftar.js";
import { deleteInstansi, editInstansi, getInstansi, getInstansibyId } from "../Controller/Instansi.js";
>>>>>>> 3ae53a6d95bc41bfb60586d96aadc12f7eb7b23f
import { Login, Logout } from "../Controller/Login/Auth.js";
import { editSurat, getSurat, getSuratbyID } from "../Controller/Surat.js";
import { editPelamar, getPelamar, getPelamarbyID } from "../Controller/Pelamar.js";

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
router.get('/api/daftar/:instansiId', getDaftarbyId)
router.get('/api/daftar-menunggu', getDaftarbyMenunggu)
router.get('/api/daftar-terima', getDaftarbyDiterima)
router.post('/api/daftar', daftar)
router.delete('/api/daftar/:id', hapusDaftar)

// API instansi
router.get('/api/instansi', getInstansi)
router.get('/api/instansi/:id', getInstansibyId)
router.patch('/api/instansi/:id', editInstansi)
router.delete('/api/instansi/:id', deleteInstansi)

// API Pelamar
router.get('/api/pelamar', getPelamar)
router.get('/api/pelamar/:id', getPelamarbyID)
router.patch('/api/pelamar/:id', editPelamar)

// API Surat
router.get('/api/surat', getSurat)
router.get('/api/surat/:id', getSuratbyID)
router.patch('/api/surat/:id', editSurat)
export default router

