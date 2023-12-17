import Users from "../../Model/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

export const Login = async (req, res) => {

    try {
        const user = await Users.findAll({
            where: {
                username: req.body.username
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password)
        if (!match) return res.status(400).json({ msg: "User dan Password Tidak Cocok" })
        const userId = user[0].id
        const username = user[0].username
        const name = user[0].name
        const role = user[0].role
        const email = user[0].email
        const accessToken = jwt.sign({ userId, username, email, name, role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "20s"
        })
        const refreshToken = jwt.sign({ userId, username, email, name, role }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "1d"
        })
        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            // sameSite: 'None',
            // Code Di Bawah Digunakan Pada Saat Menggunakan https
            // secure : true
        })
        res.status(200).json({ role: role, accessToken })
    } catch (error) {
        console.error('Error during token refresh:', error);
        res.status(404).json({ msg: "User dan Password Tidak Cocok" })
    }

}
export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });

    if (!user[0]) return res.sendStatus(204);

    const userId = user[0].id;
    await Users.update({ refreshToken: null }, {
        where: {
            id: userId
        }
    });

    res.clearCookie('refreshToken');
    return res.status(200).send('Logout successful');
};