import { prisma } from '../../lib/prisma.js'

// Setiap pesanan selalu dikembalikan lengkap dengan item dan relasi pelanggannya.
const orderInclude = { items: true, customer: true }

export const orderRepository = {
  findAll() {
    return prisma.order.findMany({
      orderBy: { date: 'desc' },
      include: orderInclude,
    })
  },

  findByStatus(status) {
    return prisma.order.findMany({
      where: { status },
      orderBy: { date: 'desc' },
      include: orderInclude,
    })
  },

  findById(id) {
    return prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    })
  },

  // items: array of { name, price, qty, productId? }
  create({ items, ...data }) {
    return prisma.order.create({
      data: {
        ...data,
        items: { create: items },
      },
      include: orderInclude,
    })
  },

  update(id, data) {
    return prisma.order.update({
      where: { id },
      data,
      include: orderInclude,
    })
  },

  delete(id) {
    return prisma.order.delete({ where: { id } })
  },
}
