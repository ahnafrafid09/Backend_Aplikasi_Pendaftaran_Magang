import jwt from "jsonwebtoken"


export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.sendStatus(403)
        req.username = decoded.username;
        next();
    })
}

export const adminOnly=(req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Ganti dengan kunci rahasia yang digunakan saat mengeluarkan token
  
      // Periksa apakah pengguna memiliki peran "admin"
      if (decoded.roles.includes('admin')) {
        next(); // Lanjutkan ke rute berikutnya jika pengguna adalah admin
      } else {
        return res.status(403).json({ error: 'Access denied. Admin only' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }