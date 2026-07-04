import { orderRepository } from './order.repository.js'
import { productRepository } from '../product/product.repository.js'
import { customerService } from '../customer/customer.service.js'
import { badRequest, notFound } from '../../lib/errors.js'

export const ORDER_STATUS = { PENDING: 'Pending', COMPLETED: 'Completed' }
export const PAYMENT_STATUS = { UNPAID: 'Belum Lunas', PAID: 'Lunas' }

export const orderService = {
  list() {
    return orderRepository.findAll()
  },

  listActive() {
    return orderRepository.findByStatus(ORDER_STATUS.PENDING)
  },

  listCompleted() {
    return orderRepository.findByStatus(ORDER_STATUS.COMPLETED)
  },

  async get(id) {
    const order = await orderRepository.findById(id)
    if (!order) throw notFound('Pesanan')
    return order
  },

  /**
   * Membuat pesanan baru.
   * @param {object} input
   * @param {{name,phone,address,note}} input.customer
   * @param {Array<{productId:number, qty:number}>} input.items
   * @param {string} input.paymentMethod
   */
  async create({ customer, items, paymentMethod }) {
    if (!customer?.name?.trim()) throw badRequest('Nama pelanggan wajib diisi')
    if (!customer?.phone?.trim()) throw badRequest('No HP pelanggan wajib diisi')
    if (!Array.isArray(items) || items.length === 0) throw badRequest('Keranjang tidak boleh kosong')

    // Resolusi harga & nama dari DB (jangan percaya harga dari client) → snapshot item.
    const orderItems = []
    let total = 0
    for (const { productId, qty } of items) {
      const quantity = Number(qty)
      if (!quantity || quantity <= 0) throw badRequest('Jumlah item harus lebih dari 0')
      const product = await productRepository.findById(Number(productId))
      if (!product) throw badRequest(`Produk dengan id ${productId} tidak ditemukan`)
      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        qty: quantity,
      })
      total += product.price * quantity
    }

    // Simpan / perbarui pelanggan ke direktori.
    const savedCustomer = await customerService.upsertByPhone(customer)

    return orderRepository.create({
      total,
      status: ORDER_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.UNPAID,
      paymentMethod: paymentMethod?.trim() || 'Transfer BCA',
      customerName: savedCustomer.name,
      customerPhone: savedCustomer.phone,
      customerAddress: savedCustomer.address,
      customerNote: customer.note?.trim() || null,
      customerId: savedCustomer.id,
      items: orderItems,
    })
  },

  // Owner mengonfirmasi pembayaran sudah masuk.
  async verifyPayment(id) {
    await this.get(id)
    return orderRepository.update(id, { paymentStatus: PAYMENT_STATUS.PAID })
  },

  // Menyelesaikan pesanan — hanya boleh jika sudah lunas.
  async complete(id) {
    const order = await this.get(id)
    if (order.paymentStatus !== PAYMENT_STATUS.PAID) {
      throw badRequest('Pesanan tidak bisa diselesaikan karena belum lunas')
    }
    return orderRepository.update(id, {
      status: ORDER_STATUS.COMPLETED,
      completedDate: new Date(),
    })
  },

  async cancel(id) {
    await this.get(id)
    return orderRepository.delete(id)
  },
}
