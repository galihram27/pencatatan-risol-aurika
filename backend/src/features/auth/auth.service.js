import bcrypt from 'bcryptjs'
import { authRepository } from './auth.repository.js'
import { signToken } from '../../lib/token.js'
import { AppError, badRequest } from '../../lib/errors.js'

// Bentuk data user yang aman dikirim ke client (tanpa password).
const toPublic = (user) => ({ id: user.id, username: user.username })

export const authService = {
  async login({ username, password }) {
    if (!username?.trim()) throw badRequest('Username wajib diisi')
    if (!password) throw badRequest('Password wajib diisi')

    const user = await authRepository.findByUsername(username.trim())
    // Pesan sengaja disamakan agar tidak membocorkan username mana yang valid.
    if (!user) throw new AppError('Username atau password salah', 401)

    const cocok = await bcrypt.compare(password, user.password)
    if (!cocok) throw new AppError('Username atau password salah', 401)

    return { token: signToken(user), user: toPublic(user) }
  },

  // Dipakai endpoint /me untuk memastikan sesi tersimpan masih valid.
  async me(userId) {
    const user = await authRepository.findById(userId)
    if (!user) throw new AppError('Sesi tidak valid', 401)
    return toPublic(user)
  },
}
