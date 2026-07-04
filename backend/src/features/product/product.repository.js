import { prisma } from '../../lib/prisma.js'

export const productRepository = {
  findAll() {
    return prisma.product.findMany({ orderBy: { id: 'asc' } })
  },

  findById(id) {
    return prisma.product.findUnique({ where: { id } })
  },

  create(data) {
    return prisma.product.create({ data })
  },

  update(id, data) {
    return prisma.product.update({ where: { id }, data })
  },

  delete(id) {
    return prisma.product.delete({ where: { id } })
  },
}
