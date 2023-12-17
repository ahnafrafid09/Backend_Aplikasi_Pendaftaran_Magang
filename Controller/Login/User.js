import Users from "../../Model/UserModel.js";
import bcrypt, { genSalt, hash } from "bcrypt"
import { Op } from "sequelize";


export const getUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 0
    const limit = parseInt(req.query.limit) || 10
    const search = (req.query.search_query) || ""
    const offset = limit * page
    const totalRows = await Users.count({
        where: {
            [Op.or]: [{
                username: {
                    [Op.like]: '%' + search + '%'
                }
            }]
        }
    })
    const totalPages = Math.ceil(totalRows / limit)
    try {
        const response = await Users.findAll({
            where: {
                [Op.or]: [{
                    username: {
                        [Op.like]: '%' + search + '%'
                    }
                }]
            },
            offset: offset,
            limit: limit,
            order: [
                ['id', 'DESC']
            ]
        });
        res.json({
            result: response,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPages
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Terjadi kesalahan dalam mencari' });
    }
}

export const getUserById = async (req, res) => {
    const userId = req.params.userId
    try {
        const response = await Users.findOne({
            where: {
                id: userId
            },
            attributes: ['id', 'name', "email", 'username', 'role']
        })
        res.status(200).json(response)
    } catch (error) {
        console.log(error);
    }
}

export const Register = async (req, res) => {
    const { username, email, name, password, confPassword, role } = req.body
    if (!username || !email || !name || !password || !confPassword) return res.status(400).json({ msg: "Harap Isi Semua" });

    if (password.length && confPassword.length < 8) return res.status(400).json({ msg: "Password Kurang Dari 8 Karakter" })
    if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password Tidak Cocok" })

    if (username.includes(" ")) return res.status(400).json({ msg: "Username tidak boleh mengandung spasi" });

    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)
    try {
        const existingUser = await Users.findOne({
            where: {
                [Op.or]: [{ username: username }, { email: email }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ msg: "Username atau Email sudah terdaftar" });
        }

        await Users.create({
            username: username,
            name: name,
            email: email,
            password: hashPassword,
            role: role
        })
        res.status(201).json({ msg: "Registrasi Berhasil" })
    } catch (error) {
        console.log(error);
    }
}

export const updateUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            id: req.params.id
        }
    })
    if (!user) return res.status(404).json({ msg: "Data User Tidak Ada" })

    const salt = await bcrypt.genSalt()
    const { username, email, name, password, confNewPassword, role } = req.body
    let hashPassword
    if (password === "" || password === null || password === undefined) {
        hashPassword = user.password
    } else {
        hashPassword = await bcrypt.hash(password, salt)
    }

    if (password !== confNewPassword) return res.status(400).json({ msg: "Password dan Confirm Password Tidak Cocok" })
    try {
        const existingUser = await Users.findOne({
            where: {
                [Op.or]: [{ username: username }, { email: email }],
                id: {
                    [Op.not]: req.params.id
                }
            }
        });

        if (existingUser) {
            return res.status(400).json({ msg: "Username atau Email sudah terdaftar" });
        }

        await user.update({
            username: username,
            email: email,
            role: role,
            name: name,
            password: hashPassword,
        })
        res.status(200).json({ msg: "Update User Berhasil" })
    } catch (error) {
        console.log(error);
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
                id: req.params.id
            }
        })
        return res.status(200).json({ msg: "User Berhasil di Hapus" })
    } catch (error) {
        return res.status(400).json({ msg: error.message })
    }
}

export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword, confNewPassword } = req.body;
    const id = req.params.id

    try {
        if (!oldPassword || !newPassword || !confNewPassword) {
            return res.status(400).json({ msg: "Data Tidak Lengkap" });
        }

        const user = await Users.findOne({
            where: {
                id: id
            },
        });

        if (!user) {
            return res.status(404).json({ msg: "User Tidak Ditemukan" });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: "Password Lama Salah" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ msg: "Password Baru Kurang Dari 8 Karakter" });
        }

        if (newPassword !== confNewPassword) {
            return res.status(400).json({ msg: "Password Baru dan Konfirmasi Password Baru Tidak Cocok" });
        }

        const salt = await bcrypt.genSalt();
        const hashNewPassword = await bcrypt.hash(newPassword, salt);

        await Users.update(
            {
                password: hashNewPassword,
            },
            {
                where: {
                    id: id
                },
            }
        );

        return res.status(200).json({ msg: "Password Berhasil Diubah" });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
};

export const updateEmail = async (req, res) => {
    const { username, newEmail, password } = req.body;

    if (!username || !newEmail || !password) {
        return res.status(400).json({ msg: "Data Tidak Lengkap" });
    }

    try {
        let user = await Users.findOne({
            where: {
                id: req.params.id
            },
        });

        if (!user) {
            return res.status(404).json({ msg: "User Tidak Ditemukan" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ msg: "Password Salah" });
        }

        const existingEmail = await Users.findOne({
            where: {
                email: newEmail,
                [Op.not]: [{ id: req.params.id }],
            },
        });

        if (existingEmail) {
            return res.status(400).json({ msg: "Email sudah digunakan oleh pengguna lain" });
        }

        await Users.update(
            {
                email: newEmail,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );

        return res.status(200).json({ msg: "Email Berhasil Diubah" });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
};
