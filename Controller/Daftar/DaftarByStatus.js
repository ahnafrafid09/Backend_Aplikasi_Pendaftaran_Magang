import Instansi from "../../Model/InstansiModel.js";
import Magang from "../../Model/MagangModel.js";
import Surat from "../../Model/SuratModel.js";
import { Op } from "sequelize";
import Pelamar from "../../Model/PelamarModel.js";
import Alasan from "../../Model/AlasanModel.js";


export const getDaftarByIdSelesai = async (req, res) => {
    try {
        const instansiID = req.params.instansiId;

        const dataInstansi = await Instansi.findByPk(instansiID, {
            include: [
                {
                    model: Pelamar
                },
                {
                    model: Surat
                },
                {
                    model: Magang
                },
                {
                    model: Alasan,
                    attributes: ["alasan_tolak"]
                },
            ],

        });

        if (dataInstansi) {
            res.json(dataInstansi);
        } else {
            res.status(404).json({ msg: 'Instansi tidak ditemukan.' });
        }
    } catch (error) {
        console.error('Kesalahan:', error);
        res.status(500).send('Terjadi kesalahan server');
    }
}

export const getDaftarbyMenunggu = async (req, res) => {
    const page = parseInt(req.query.page) || 0
    const limit = parseInt(req.query.limit) || 10
    const search = (req.query.search_query) || ""
    const offset = limit * page
    const totalRows = await Instansi.count({
        where: {
            status: "Menunggu",
            [Op.or]: [{
                nama_instansi: {
                    [Op.like]: '%' + search + '%'
                }
            }]
        }
    })
    const totalPages = Math.ceil(totalRows / limit)
    try {
        const response = await Instansi.findAll({
            where: {
                status: 'Menunggu',
            },
            include: {
                model: Surat,
                attributes: ['tanggal_pengajuan']
            },
            offset: offset,
            limit: limit,
            order: [
                ['id', 'DESC']
            ]
        });
        res.json({
            result: response,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPages
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Terjadi kesalahan dalam mencari' });
    }
};

export const getDaftarbyDiterima = async (req, res) => {
    const response = ['Diterima', 'Aktif'];
    const page = parseInt(req.query.page) || 0
    const limit = parseInt(req.query.limit) || 10
    const search = (req.query.search_query) || ""
    const offset = limit * page
    const totalRows = await Instansi.count({
        where: {
            status: response,
            [Op.or]: [{
                nama_instansi: {
                    [Op.like]: '%' + search + '%'
                }
            }]
        },

    })
    const totalPages = Math.ceil(totalRows / limit)

    try {
        const result = await Magang.findAll({
            include: {
                model: Instansi,
                where: {
                    status: response,
                },
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

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Terjadi kesalahan dalam mencari' });
    }
};
export const getDaftarSelesai = async (req, res) => {
    const response = ['Selesai', 'Ditolak'];
    const page = parseInt(req.query.page) || 0
    const limit = parseInt(req.query.limit) || 10
    const search = (req.query.search_query) || ""
    const offset = limit * page
    const totalRows = await Instansi.count({
        where: {
            status: response,
            [Op.or]: [{
                nama_instansi: {
                    [Op.like]: '%' + search + '%'
                }
            }]
        },

    })
    const totalPages = Math.ceil(totalRows / limit)

    try {
        const result = await Instansi.findAll({
            where: {
                status: response,
            }, include: { model: Surat, attributes: ["tanggal_pengajuan"] },
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

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Terjadi kesalahan dalam mencari' });
    }
};
