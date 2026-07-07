import 'dotenv/config'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'dev-secret-ganti-di-produksi'
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d'

// Membuat token login. Payload minimal: id, username.
export function signToken(user) {
  return jwt.sign(
    { sub: user.id, username: user.username },
    SECRET,
    { expiresIn: EXPIRES_IN },
  )
}

// Memverifikasi token; melempar error bila tidak valid / kedaluwarsa.
export function verifyToken(token) {
  return jwt.verify(token, SECRET)
}
