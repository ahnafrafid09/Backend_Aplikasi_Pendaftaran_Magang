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
    if (req.files === null) {
        fileName = Surat.file
    } else {
        const pdfFile = req.files.pdfFile;
        fileName = pdfFile.name
        if (req.files && pdfFile) {
            if (path.extname(pdfFile.name) !== '.pdf') {
                return res.status(400).json({ msg: 'File harus berformat PDF' });
            }
            const filePath = `public/files/${surat.file}`;

            fs.unlinkSync(filePath)
            pdfFile.mv(`public/files/${fileName}`, (err) => {
                if (err) {
                    return res.status(500).json({ msg: 'Gagal menyimpan berkas PDF.' });
                }
            });
        }
    }
    const noSurat = req.body.noSurat
    const tglPengajuan = req.body.tglPengajuan
    const url = `${req.protocol}://${req.get("host")}/files/${fileName}`;
    try {
        await Surat.update({
            no_surat: noSurat,
            tanggal_pengajuan: tglPengajuan,
            file: fileName,
            url: url,
        }, {
            where: { id: suratId }
        })
        res.status(200).json({ msg: "Data Berhasil Di Update" })
    } catch (error) {
        console.log("Edit Surat Error:", error);
        return res.status(500).json({ msg: "Data Gagal Di Update" })

    }
};
