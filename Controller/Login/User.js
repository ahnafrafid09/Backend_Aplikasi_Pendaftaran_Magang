import Users from "../../Model/UserModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ["id", "username", "email"]
        });
        res.status(200).json(users)
    } catch (error) {
        console.log(error);
    }
}

export const Register = async (req, res) => {
    const { username, email, password, confPassword } = req.body
    if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password Tidak Cocok" })
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)
    try {
        await Users.create({
            username: username,
            email: email,
            password: hashPassword
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
    const { username, email, password, confPassword } = req.body
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
            email: email,
            password: hashPassword,
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

export const Login = async (req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                username: req.body.username
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password)
        if (!match) return res.status(400).json({ msg: "Password Salah" })
        const userId = user[0].id
        const username = user[0].username
        const email = user[0].email
        const accessToken = jwt.sign({ userId, username, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "20s"
        })
        const refreshToken = jwt.sign({ userId, username, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "1d"
        })
        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 100,
            // Code Di Bawah Digunakan Pada Saat Menggunakan https
            // secure : true
        })
        res.json({ accessToken })
    } catch (error) {
        res.status(404).json({ msg: "User tidak ditemukan" })
    }
}
export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(204)
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    })
    if (!user[0]) return res.sendStatus(204)
    const userId = user[0].id
    await Users.update({ refreshToken: null }, {
        where: {
            id: userId
        }
    })
    res.clearCookie('refreshToken')
    return res.status(200)
}