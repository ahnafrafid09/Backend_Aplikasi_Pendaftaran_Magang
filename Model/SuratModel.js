import { Sequelize } from "sequelize"
import db from "../Database/db.js"
import Instansi from "./InstansiModel.js";

const { DataTypes } = Sequelize;

const Surat = db.define('surat', {
    no_surat: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tanggal_pengajuan: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    file: {
        type: DataTypes.STRING,
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
    }
})

Instansi.hasOne(Surat)
Surat.belongsTo(Instansi)


export default Surat