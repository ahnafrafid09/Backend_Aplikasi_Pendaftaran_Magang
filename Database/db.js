import { Sequelize } from "sequelize";

const db = new Sequelize('db_pengajuan_magang', 'root', '', {
    host: 'localhost',
    dialect : "mysql"
});



export default db
