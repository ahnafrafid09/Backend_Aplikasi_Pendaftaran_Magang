import { Sequelize } from "sequelize";

const db = new Sequelize('db_pendaftaran_magang', 'root', '', {
    host: 'localhost',
    dialect: "mysql"
});




export default db
