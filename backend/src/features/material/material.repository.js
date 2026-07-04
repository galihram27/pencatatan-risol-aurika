import { prisma } from '../../lib/prisma.js'

export const materialRepository = {
  findAll() {
    return prisma.material.findMany({ orderBy: { id: 'asc' } })
  },

  findById(id) {
    return prisma.material.findUnique({ where: { id } })
  },

  create(data) {
    return prisma.material.create({ data })
  },

  update(id, data) {
    return prisma.material.update({ where: { id }, data })
  },

  delete(id) {
    return prisma.material.delete({ where: { id } })
  },
}
