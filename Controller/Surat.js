import Surat from "../Model/SuratModel.js";
import Instansi from "../Model/InstansiModel.js";
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
            where:{
                id:req.params.id
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

    try {
        const surat = await Surat.findOne({
            where: {
                id: suratId
            }
        });

        if (!surat) {
            return res.status(404).json({ error: "Surat tidak ditemukan" });
        }

        surat.no_surat = req.body.no_surat; 
        surat.tanggal_pengajuan = req.body.tanggal_pengajuan;

        if (req.files && req.files.pdfFile) {
            if (path.extname(req.files.pdfFile.name) !== '.pdf') {
                return res.status(400).json({ message: 'File harus berformat PDF' });
            }
            const pdfFile = req.files.pdfFile;
            const url = `public/files/${pdfFile.name}`;

            pdfFile.mv(url, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Gagal menyimpan berkas PDF.' });
                }
            });

            surat.file = pdfFile.name;
            surat.url = url;
        }

        await surat.save(); 

        res.status(200).json({ msg: "Surat Berhasil Di Update" });
    } catch (error) {
        console.log("Edit Surat Error:", error);
        res.status(500).json({ error: "Terjadi kesalahan dalam mengedit Surat" });
    }
};
