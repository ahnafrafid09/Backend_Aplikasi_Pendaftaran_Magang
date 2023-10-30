import { Sequelize } from "sequelize";
import db from "../Database/db.js";

const { DataTypes } = Sequelize
const Users = db.define('users', {
    username: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    refresh_token: {
        type: DataTypes.TEXT
    },
    name:{
        type: DataTypes.STRING
    },
    role:{
        type: DataTypes.ENUM,
        values:['admin', 'user'],
        defaultValue:"user"
    }
}, {
    freezeTableName: true
}
)


export default Users;