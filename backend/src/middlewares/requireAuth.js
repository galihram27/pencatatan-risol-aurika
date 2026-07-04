import { verifyToken } from '../lib/token.js'
import { AppError } from '../lib/errors.js'

// Middleware proteksi rute: memerlukan header "Authorization: Bearer <token>".
// Pasang pada rute yang ingin dibatasi hanya untuk owner yang sudah login.
export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) throw new AppError('Token tidak ditemukan', 401)
    req.user = verifyToken(token) // { sub, username, role, iat, exp }
    next()
  } catch (err) {
    if (err instanceof AppError) return next(err)
    next(new AppError('Sesi tidak valid atau kedaluwarsa', 401))
  }
}
