import Instansi from "../Model/InstansiModel.js";
import Magang from "../Model/MagangModel.js"
import db from "../Database/db.js";
import cron from "node-cron"
import { Op } from "sequelize";

const updateStatusToAktif = async () => {
    try {
        const currentDate = db.fn('NOW');
        const magangToUpdate = await Magang.findAll({
            where: {
                tanggal_masuk: { [Op.lte]: currentDate },
            },
        });

        for (const magang of magangToUpdate) {
            await Instansi.update({ status: 'Aktif' }, { where: { id: magang.instansiId } });
        }
    } catch (error) {
        console.error('Error updating status to Aktif:', error);
    }
};

const updateStatusToSelesai = async (req, res) => {
    try {
        const currentDate = db.fn('NOW');;
        const magangToUpdate = await Magang.findAll({
            where: {
                tanggal_selesai: { [Op.lte]: currentDate },
            },
        });

        for (const magang of magangToUpdate) {
            await Instansi.update({ status: 'Selesai' }, { where: { id: magang.instansiId } });
        }
    } catch (error) {
        console.error('Error updating status to Selesai:', error);
    }
};

const runScheduler = async () => {
    try {
        await updateStatusToAktif();
        await updateStatusToSelesai();
        console.log('Scheduler executed successfully');
    } catch (error) {
        console.error('Error executing scheduler:', error);
    }
};

export const startScheduler = () => {
    cron.schedule('01 0 * * *', runScheduler);
};

export const UpdateMagangInstansi = async (req, res) => {
    try {
        const { instansiId } = req.params;
        const transaction = await db.transaction();
        try {
            const updatedInstansi = await Instansi.update(
                { status: req.body.status },
                { where: { id: instansiId }, transaction }
            );

            const updatedMagang = await Magang.update(
                {
                    tanggal_masuk: req.body.tglMasuk,
                    tanggal_selesai: req.body.tglSelesai
                },
                { where: { instansiId }, transaction }
            );
            await transaction.commit();

            res.status(200).json({ msg: 'Data Berhasil di Update', updatedInstansi, updatedMagang });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



