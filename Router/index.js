import Express from "express";
import { verifyToken, adminOnly } from "../Middleware/VerifToken.js";
import { getUsers, Register, updateUser, deleteUser, updateEmail, updatePassword } from "../Controller/Login/User.js";
import { refreshToken } from "../Controller/Login/RefreshToken.js";
import { Login, Logout } from "../Controller/Login/Auth.js";
import { daftar, hapusDaftar, getDaftarbyId, getDaftar, terimaMagang, tolakMagang } from "../Controller/Daftar/Daftar.js";
import { getDaftarSelesai, getDaftarbyMenunggu, getDaftarbyDiterima, getDaftarByIdSelesai } from "../Controller/Daftar/DaftarByStatus.js";
import { deleteInstansi, getInstansi, getInstansibyId, editInstansi, getInstansiByUserId } from "../Controller/Instansi.js";
import { editSurat, getSurat, getSuratbyID } from "../Controller/Surat.js";
import { deletePelamar, editPelamar, getPelamar, getPelamarbyID } from "../Controller/Pelamar.js";
import { UpdateMagangInstansi } from "../Controller/InstansiMagang.js";

const router = Express.Router()
// API Login dan User
router.get("/api/users", adminOnly, getUsers)
router.delete("/api/users/:id", adminOnly, deleteUser)
router.patch("/api/users/:id/change-password", updatePassword)
router.patch("/api/users/:id/change-email", updateEmail)
router.post("/api/register", Register)
router.post("/api/login", Login)
router.get("/api/token", refreshToken)
router.delete("/api/logout", Logout)

// API daftar
router.get('/api/daftar', adminOnly, getDaftar)
router.get('/api/daftar/:instansiId', verifyToken, getDaftarbyId)
router.post('/api/daftar', verifyToken, daftar)
router.post('/api/daftar/terima/:id', adminOnly, terimaMagang)
router.patch('/api/daftar/tolak/:id', adminOnly, tolakMagang)
router.delete('/api/daftar/:id', verifyToken, hapusDaftar)

// API instansi
router.get('/api/instansi', adminOnly, getInstansi)
router.get('/api/instansi/:id', adminOnly, getInstansibyId)
router.get('/api/:userId/instansi', getInstansiByUserId)
router.patch('/api/instansi/:id', adminOnly, editInstansi)
router.delete('/api/instansi/:id', adminOnly, deleteInstansi)

// API Pelamar
router.get('/api/pelamar', adminOnly, getPelamar)
router.get('/api/pelamar/:id', adminOnly, getPelamarbyID)
router.patch('/api/pelamar/:id', adminOnly, editPelamar)
router.delete('/api/pelamar/:id', adminOnly, deletePelamar)

// API Surat
router.get('/api/surat', adminOnly, getSurat)
router.get('/api/surat/:id', adminOnly, getSuratbyID)
router.patch('/api/surat/:id', adminOnly, editSurat)

// API Instansi dan Magang
router.patch('/api/instansi-magang/:instansiId',  UpdateMagangInstansi)

// API Instansi By Status
router.get('/api/daftar-menunggu', adminOnly, getDaftarbyMenunggu)
router.get('/api/daftar-terima', adminOnly, getDaftarbyDiterima)
router.get('/api/daftar-selesai', adminOnly, getDaftarSelesai)
router.get('/api/daftar-selesai/:instansiId', verifyToken, getDaftarByIdSelesai)
export default router

