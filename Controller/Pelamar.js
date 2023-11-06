import Pelamar from "../Model/PelamarModel.js";
import Instansi from "../Model/InstansiModel.js";

export const getPelamar = async (req, res) => {
    try {
        const pelamar = await Pelamar.findAll({
            attributes: ["id", "nama_lengkap", "email", "alamat", "no_telepon", "no_induk"]
        });
        res.status(200).json(pelamar)
    } catch (error) {
        console.log(error);
    }
}

export const getPelamarbyID = async (req, res) => {

    try {
        const response = await Pelamar.findOne({
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

export const editPelamar = async (req, res) => {
    const pelamarId = req.params.id;

    try {
        const pelamar = await Pelamar.findOne({
            where: {
                id: pelamarId
            }
        });

        if (!pelamar) {
            return res.status(404).json({ error: "Pelamar tidak ditemukan" });
        }
        const updatePelamar = await pelamar.update({
            nama_lengkap: req.body.nama_lengkap, 
            email: req.body.email, 
            alamat: req.body.alamat, 
            no_telepon: req.body.no_telepon, 
            no_induk: req.body.no_induk 
        });

        res.status(200).json({ msg: "Pelamar Berhasil Di Update" })
    } catch (error) {
        console.log("Edit Pelamar Error:", error);
        res.status(500).json({ error: "Terjadi kesalahan dalam mengedit pelamar" });
    }
};

