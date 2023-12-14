import Express from "express";
import { adminOnly } from "../Middleware/VerifToken.js";
import { getUserById, getUsers, updateUser, deleteUser } from "../Controller/Login/User.js";
import { getDaftarSelesai, getDaftarbyMenunggu, getDaftarbyDiterima, getDaftarByIdSelesai } from "../Controller/Daftar/DaftarByStatus.js";
import { terimaMagang, tolakMagang } from "../Controller/Daftar/Daftar.js"
import { deletePelamar, editPelamar, getPelamar, getPelamarbyID } from "../Controller/Pelamar.js";
import { editSurat, getSurat, getSuratbyID } from "../Controller/Surat.js";
import { UpdateMagangInstansi } from "../Controller/InstansiMagang.js";
import { getInstansibyId, deleteInstansi, editInstansi } from "../Controller/Instansi.js";

const adminRoute = Express.Router()

adminRoute.get("/users", adminOnly, getUsers)
adminRoute.get("/user/:userId", adminOnly, getUserById)
adminRoute.patch('/user/:id', adminOnly, updateUser)
adminRoute.delete("/user/:id", adminOnly, deleteUser)

adminRoute.post('/daftar/terima/:id', adminOnly, terimaMagang)
adminRoute.patch('/daftar/tolak/:id', adminOnly, tolakMagang)



adminRoute.get('/instansi/:id', adminOnly, getInstansibyId)
adminRoute.patch('/instansi/:id', adminOnly, editInstansi)
adminRoute.delete('/instansi/:id', adminOnly, deleteInstansi)

adminRoute.get('/pelamar', adminOnly, getPelamar)
adminRoute.get('/pelamar/:id', adminOnly, getPelamarbyID)
adminRoute.patch('/pelamar/:id', adminOnly, editPelamar)
adminRoute.delete('/pelamar/:id', adminOnly, deletePelamar)

adminRoute.get('/surat', adminOnly, getSurat)
adminRoute.get('/surat/:id', adminOnly, getSuratbyID)
adminRoute.patch('/surat/:id', adminOnly, editSurat)

adminRoute.get('/daftar-menunggu', adminOnly, getDaftarbyMenunggu)
adminRoute.get('/daftar-terima', adminOnly, getDaftarbyDiterima)
adminRoute.get('/daftar-selesai', adminOnly, getDaftarSelesai)
adminRoute.get('/daftar-selesai/:instansiId', adminOnly, getDaftarByIdSelesai)
adminRoute.patch('/instansi-magang/:instansiId', adminOnly, UpdateMagangInstansi)

export default adminRoute