import Users from "../../Model/UserModel.js";
import bcrypt from "bcrypt"
import { Op, or } from "sequelize";


export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ["id", "username", "email", "name"]
        });
        res.status(200).json(users)
    } catch (error) {
        console.log(error);
    }
}

export const Register = async (req, res) => {
    const { username, email, name, password, confPassword, role } = req.body
    if (!username || !email || !name || !password || !confPassword) return res.status(400).json({ msg: "Harap Isi Semua" });

    if (password.length && confPassword.length < 8) return res.status(400).json({ msg: "Password Kurang Dari 8 Karakter" })
    if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password Tidak Cocok" })

    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)
    try {
        console.log("Username:", username);
        console.log("Email:", email);

        const existingUser = await Users.findOne({
            where: {
                [Op.or]: [{ username: username }, { email: email }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ msg: "Username atau Email sudah terdaftar" });
        }
        console.log("Existing User:", existingUser);

        await Users.create({
            username: username,
            name: name,
            email: email,
            password: hashPassword,
            role: role
        })
        res.json({ msg: "Registrasi Berhasil" })
    } catch (error) {
        console.log(error);
    }
}

export const updateUser = async (req, res) => {
    const user = Users.findOne({
        where: {
            id: req.params.id
        }
    })
    if (!user) return res.status(404).json({ msg: "User Tidak Ditemukan" })
    const { username, email, name, password, confPassword, role } = req.body
    if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password Tidak Cocok" })
    const salt = await bcrypt.genSalt()
    let hashPassword
    if (password === '' || password === null) {
        hashPassword = user.password
    } else {
        hashPassword = await bcrypt.hash(password, salt)
    }
    if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password Tidak Cocok" })
    try {
        await Users.update({
            username: username,
            name: name,
            email: email,
            password: hashPassword,
            role: role
        }, {
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({ msg: "User Berhasil Di Update" })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const deleteUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            id: req.params.id
        }
    })
    if (!user) return res.status(404).json({ msg: "User Tidak Ditemukan" })
    try {
        await Users.destroy({
            where: {
                id: user.id
            }
        })
        return res.status(200).json({ msg: "User Berhasil di Hapus" })
    } catch (error) {
        return res.status(400).json({ msg: error.message })
    }
}

