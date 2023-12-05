import Express from "express";
import { verifyToken, adminOnly } from "../Middleware/VerifToken.js";
import { getUsers, Register, updateUser, deleteUser } from "../Controller/Login/User.js";
import { refreshToken } from "../Controller/Login/RefreshToken.js";
import { Login, Logout } from "../Controller/Login/Auth.js";
import { daftar, hapusDaftar, getDaftarbyId, getDaftar, terimaMagang, tolakMagang } from "../Controller/Daftar/Daftar.js";
import { getDaftarSelesai, getDaftarbyMenunggu, getDaftarbyDiterima, getDaftarByIdSelesai } from "../Controller/Daftar/DaftarByStatus.js";
import { deleteInstansi, getInstansi, getInstansibyId, editInstansi } from "../Controller/Instansi.js";
import { editSurat, getSurat, getSuratbyID } from "../Controller/Surat.js";
import { deletePelamar, editPelamar, getPelamar, getPelamarbyID } from "../Controller/Pelamar.js";
import { UpdateMagangInstansi } from "../Controller/InstansiMagang.js";

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
router.post('/api/daftar', daftar)
router.post('/api/daftar/terima/:id', terimaMagang)
router.patch('/api/daftar/tolak/:id', tolakMagang)
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
router.delete('/api/pelamar/:id', deletePelamar)

// API Surat
router.get('/api/surat', getSurat)
router.get('/api/surat/:id', getSuratbyID)
router.patch('/api/surat/:id', editSurat)

// API Instansi dan Magang
router.patch('/api/instansi-magang/:instansiId', UpdateMagangInstansi)

// API Instansi By Status
router.get('/api/daftar-menunggu', verifyToken, adminOnly, getDaftarbyMenunggu)
router.get('/api/daftar-terima', getDaftarbyDiterima)
router.get('/api/daftar-selesai', getDaftarSelesai)
router.get('/api/daftar-selesai/:instansiId', getDaftarByIdSelesai)
export default router

