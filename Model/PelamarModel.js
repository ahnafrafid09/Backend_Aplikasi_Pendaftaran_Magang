import { Sequelize } from "sequelize";
import db from "../Database/db.js";
import Instansi from "./InstansiModel.js";

const { DataTypes } = Sequelize

const Pelamar = db.define('pelamar', {
    nama_lengkap: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alamat: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    no_telepon: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    no_induk: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

}, {
    freezeTableName: true
})

Instansi.hasOne(Pelamar)
Pelamar.belongsTo(Instansi)

export default Pelamar