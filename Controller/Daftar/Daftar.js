import Instansi from "../../Model/InstansiModel.js";
import Magang from "../../Model/MagangModel.js";
import Pelamar from "../../Model/PelamarModel.js";
import Surat from "../../Model/SuratModel.js";
import path from "path";
import { Op } from "sequelize";
import fs from "fs";
import Alasan from "../../Model/AlasanModel.js";
import { jwtDecode } from "jwt-decode";

export const getDaftar = async (req, res) => {
    const page = parseInt(req.query.page) || 0
    const limit = parseInt(req.query.limit) || 10
    const search = (req.query.search_query) || ""
    const offset = limit * page
    const totalRows = await Instansi.count({
        where: {
            [Op.or]: [{
                nama_instansi: {
                    [Op.like]: '%' + search + '%'
                }
            }]
        }
    })
    const totalPages = Math.ceil(totalRows / limit)
    const result = await Instansi.findAll({
        include: [Surat, Magang, Pelamar],
        where: {
            [Op.or]: [{
                nama_instansi: {
                    [Op.like]: '%' + search + '%'
                }
            }]
        },
        offset: offset,
        limit: limit,
        order: [
            ['id', 'DESC']
        ]
    })
    res.json({
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPages
    });
}

export const getInstansiByUserId = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwtDecode(token);
        console.log(decoded.userId);
        const userId = decoded.userId

        const instansi = await Instansi.findAll({
            where: {
                userId: userId
            },
            include: [Surat, Magang, Pelamar],
        });

        res.status(200).json(instansi);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Terjadi kesalahan dalam mencari' });
    }
};


export const getDaftarbyId = async (req, res) => {
    try {
        const instansiID = req.params.instansiId;

        const dataInstansi = await Instansi.findByPk(instansiID, {
            include: [Surat, Magang, Pelamar, Alasan]

        });

        if (dataInstansi) {
            res.json(dataInstansi);
        } else {
            res.status(404).send('Instansi tidak ditemukan.');
        }
    } catch (error) {
        console.error('Kesalahan:', error);
        res.status(500).send('Terjadi kesalahan server');
    }
}


export const daftar = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwtDecode(token)
    const userId = decoded.userId
    const pelamar = JSON.parse(req.body.pelamar);
    if (!pelamar || pelamar.length === 0 || !req.body.noSurat || !req.body.tglPengajuan || !req.body.namaInstansi || !req.body.alamatInstansi || !req.body.kategori) return res.status(400).json({ msg: 'Data Harus di Isi Semua' });
    try {
        const instansi = await Instansi.create({
            nama_instansi: req.body.namaInstansi,
            alamat: req.body.alamatInstansi,
            kategori: req.body.kategori,
            userId: userId
        })

        if (req.files === null) return res.status(400).json({ msg: 'Mohon unggah berkas PDF.' });

        const pdfFile = req.files.pdfFile;
        const fileSize = pdfFile.data.length
        const ext = path.extname(pdfFile.name);
        const fileName = pdfFile.md5 + ext;
        const url = `${req.protocol}://${req.get("host")}/files/${fileName}`;
        const allowedType = ['.pdf'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "File Harus Berformat PDF" });
        if (fileSize > 5000000) return res.status(422).json({ msg: "File Tidak Boleh Lebih Dari 5MB" });


        pdfFile.mv(`public/files/${fileName}`, async (err) => {
            if (err) return res.status(500).json({ error: 'Gagal menyimpan berkas PDF.' });
            await Surat.create({
                no_surat: req.body.noSurat,
                tanggal_pengajuan: req.body.tglPengajuan,
                file: fileName,
                url: url,
                fileName: pdfFile.name,
                instansiId: instansi.id
            })
        });

        for (const pelamarData of pelamar) {
            await Pelamar.create({
                nama_lengkap: pelamarData.namaLengkap,
                email: pelamarData.email,
                alamat: pelamarData.alamat,
                no_telepon: pelamarData.noTelp,
                no_induk: pelamarData.noInduk,
                instansiId: instansi.id
            })
        }
        res.status(201).json({ msg: "Data Berhasil Disimpan" });
    } catch (error) {
        console.error('Gagal membuat Instansi, Surat, dan Pelamar:', error);
        res.status(500).json({ msg: 'Terjadi kesalahan dalam membuat data' });
    }
}

export const hapusDaftar = async (req, res) => {
    const instansiId = req.params.id

    try {
        const daftar = await Instansi.findByPk(instansiId, {
            include: [Surat, Magang, Pelamar]
        })
        if (!daftar) return res.status(404).json({ msg: "Daftar Tidak Tersedia" })

        const url = daftar.surat.url
        fs.unlink(url, (err) => {
            if (err) {
                console.error('Gagal menghapus berkas PDF:', err);
                return res.status(500).json({ error: 'Gagal menghapus berkas PDF.' });
            }
            daftar.destroy();

            res.json({ message: 'Instansi dan berkas PDF berhasil dihapus.' });
        });
    } catch (error) {
        console.error('Gagal menghapus:', error);
        res.status(500).json({ error: 'Terjadi kesalahan dalam menghapus' });
    }
}

export const terimaMagang = async (req, res) => {
    const id = req.params.id
    try {
        await Instansi.update({
            status: "Diterima",
        }, {
            where: { id: id }
        })
        await Magang.create({
            tanggal_masuk: req.body.tglMasuk,
            tanggal_selesai: req.body.tglSelesai,
            bagian: req.body.bagian,
            instansiId: id
        })
        res.status(201).json({ msg: "Pendaftaran Magang Berhasil Diterima" })
    } catch (error) {
        res.status(400).json({ msg: "Gagal Diperbarui" })
        console.log("error", error);
    }
}

export const tolakMagang = async (req, res) => {
    const id = req.params.id
    try {
        await Instansi.update({
            status: "Ditolak",
        }, {
            where: { id: id }
        })

        await Alasan.create({ alasan_tolak: req.body.alasan, instansiId: id })

        res.status(200).json({ msg: "Pendaftaran Magang Berhasil di Tolak" })
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "Gagal Di Perbarui" })
    }
}