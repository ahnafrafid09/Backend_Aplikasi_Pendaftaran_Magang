import { Sequelize } from "sequelize";
import db from "../Database/db.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize
const Instansi = db.define('instansi', {
    nama_instansi: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alamat: {
        type: DataTypes.STRING,
        allowNull: false
    },
    kategori: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["SMA/SMK", "Perguruan Tinggi", "Kategori Lainnya"],
    },
    status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['Menunggu', 'Diterima', 'Aktif', 'Ditolak', 'Selesai'],
        defaultValue: 'Menunggu'
    },
}, {
    freezeTableName: true
})

Users.hasMany(Instansi)
Instansi.belongsTo(Users)



export default Instansi