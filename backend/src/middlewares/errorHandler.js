import { AppError } from '../lib/errors.js'

// Middleware error terpusat — dipasang paling akhir di server.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Error bisnis yang kita lempar sendiri
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message })
  }

  // Pelanggaran unique constraint Prisma (mis. nomor HP sudah terdaftar)
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] ?? 'data'
    return res.status(409).json({ message: `${field} sudah terdaftar` })
  }

  // Record tidak ditemukan saat update/delete
  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Data tidak ditemukan' })
  }

  console.error(err)
  res.status(500).json({ message: 'Terjadi kesalahan pada server' })
}
