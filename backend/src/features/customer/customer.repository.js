import { prisma } from '../../lib/prisma.js'

// Menyertakan orderCount (jumlah pesanan) yang dihitung dari relasi orders.
const withOrderCount = { _count: { select: { orders: true } } }

export const customerRepository = {
  findAll() {
    return prisma.customer.findMany({
      orderBy: { id: 'asc' },
      include: withOrderCount,
    })
  },

  findById(id) {
    return prisma.customer.findUnique({
      where: { id },
      include: withOrderCount,
    })
  },

  findByPhone(phone) {
    return prisma.customer.findUnique({ where: { phone } })
  },

  create(data) {
    return prisma.customer.create({ data })
  },

  update(id, data) {
    return prisma.customer.update({ where: { id }, data })
  },

  delete(id) {
    return prisma.customer.delete({ where: { id } })
  },
}
