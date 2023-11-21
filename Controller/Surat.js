import Surat from "../Model/SuratModel.js";
import Instansi from "../Model/InstansiModel.js";
import fs from 'fs'
import path from 'path';

export const getSurat = async (req, res) => {
    try {
        const surat = await Surat.findAll({
            attributes: ["id", "no_surat", "tanggal_pengajuan", "file", "url"]
        });
        res.status(200).json(surat)
    } catch (error) {
        console.log(error);
    }
}

export const getSuratbyID = async (req, res) => {

    try {
        const response = await Surat.findOne({
            where: {
                id: req.params.id
            }
        })
        res.status(200).json(response)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Terjadi kesalahan dalam mencari' });
    }
}

export const editSurat = async (req, res) => {
    const suratId = req.params.id;

    const surat = await Surat.findOne({
        where: {
            id: suratId
        }
    });
    if (!surat) return res.status(404).json({ msg: "Surat tidak ditemukan" });


    let fileName = ''
    let file = ''
    if (req.files === null) {
        fileName = surat.fileName
        file = surat.file
    } else {
        const pdfFile = req.files.pdfFile;
        fileName = pdfFile.name
        const fileSize = pdfFile.data.length
        const ext = path.extname(pdfFile.name);
        file = pdfFile.md5 + ext;
        const allowedType = ['.pdf'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "File Harus Berformat PDF" });
        if (fileSize > 5000000) return res.status(422).json({ msg: "File Tidak Boleh Lebih Dari 5MB" });

        const filePath = `public/files/${surat.file}`;
        fs.unlinkSync(filePath);

        pdfFile.mv(`public/files/${file}`, (err) => {
            if (err) return res.status(500).json({ msg: 'Gagal menyimpan berkas PDF.' })
        });
    }
    const noSurat = req.body.noSurat
    const tglPengajuan = req.body.tglPengajuan
    const url = `${req.protocol}://${req.get("host")}/files/${file}`;
    try {
        await Surat.update({
            no_surat: noSurat,
            tanggal_pengajuan: tglPengajuan,
            fileName: fileName,
            file: file,
            url: url,
        }, {
            where: { id: suratId }
        })
        res.status(200).json({ msg: "Data Surat Berhasil Di Update" })
    } catch (error) {
        console.log("Edit Surat Error:", error);
        return res.status(500).json({ msg: "Data Gagal Di Update" })

    }
};
