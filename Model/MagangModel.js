import { Sequelize } from "sequelize";
import db from "../Database/db.js";
import Instansi from "./InstansiModel.js";

const { DataTypes } = Sequelize

const Magang = db.define('magang', {
    tanggal_masuk: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    tanggal_selesai: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    bagian: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['Sekertariat',
            'Statistik',
            'Aptika',
            'IKP',
            'Sandikami',
            'E-gov',
            'JDS']
    },
    instansiId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
})

// relasi Magang dengan instansi
Instansi.hasOne(Magang)
Magang.belongsTo(Instansi)



export default Magang