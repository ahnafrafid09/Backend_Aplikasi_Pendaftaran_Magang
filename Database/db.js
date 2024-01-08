import { Sequelize } from "sequelize";

const db = new Sequelize('freedb_db_pendaftaran_magang', 'freedb_username123', '9C$RvV3pgKf#JXB', {
    host: 'sql.freedb.tech',
    dialect: "mysql"
});



export default db
