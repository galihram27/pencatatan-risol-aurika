import { prisma } from '../../lib/prisma.js'

export const authRepository = {
  findByUsername(username) {
    return prisma.user.findUnique({ where: { username } })
  },

  findById(id) {
    return prisma.user.findUnique({ where: { id } })
  },
}
