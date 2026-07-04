// Error dengan status HTTP agar controller bisa memetakan respons dengan tepat.
export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
  }
}

export const notFound = (entity) => new AppError(`${entity} tidak ditemukan`, 404)
export const badRequest = (message) => new AppError(message, 400)
