import Instansi from "../Model/InstansiModel.js";

export const getInstansi = async (req, res) => {
    try {
        const instansi = await Instansi.findAll({
            attributes: ["id", "nama_instansi", "alamat", "status"]
        });
        res.status(200).json(instansi)
    } catch (error) {
        console.log(error);
    }
}
export const getInstansibyId = async (req, res) => {

    try {
        const response = await Instansi.findOne({
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
export const deleteInstansi = async (req, res) => {
    const instansi = await Instansi.findOne({ where: { id: req.params.id } })
    if (!instansi) return res.status(404).json({ msg: "Instansi Tidak Tersedia" })

    try {
        await Instansi.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({ msg: "Berhasil di Hapus" })
    } catch (error) {
        console.log("Delete Instansi Gagal", error);
        res.status(400).json({ msg: "Terdapat Kesalahan Dalam Menghapus Instansi" })
    }
}