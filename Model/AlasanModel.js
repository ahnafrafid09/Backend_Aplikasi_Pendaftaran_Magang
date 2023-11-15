import { Sequelize } from "sequelize";
import db from "../Database/db.js";
import Instansi from "./InstansiModel.js";

const { DataTypes } = Sequelize
const Alasan = db.define('alasan', {
    alasan_tolak: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    freezeTableName: true
})

Instansi.hasOne(Alasan)
Alasan.belongsTo(Instansi)


export default Alasan