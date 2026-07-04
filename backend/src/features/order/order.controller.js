import { orderService } from './order.service.js'

export const orderController = {
  // Mendukung filter ?status=active|completed
  async list(req, res) {
    const { status } = req.query
    if (status === 'active') return res.json(await orderService.listActive())
    if (status === 'completed') return res.json(await orderService.listCompleted())
    res.json(await orderService.list())
  },

  async get(req, res) {
    res.json(await orderService.get(Number(req.params.id)))
  },

  async create(req, res) {
    res.status(201).json(await orderService.create(req.body))
  },

  // Konfirmasi pembayaran → Lunas
  async verifyPayment(req, res) {
    res.json(await orderService.verifyPayment(Number(req.params.id)))
  },

  // Selesaikan pesanan (hanya jika lunas)
  async complete(req, res) {
    res.json(await orderService.complete(Number(req.params.id)))
  },

  async cancel(req, res) {
    await orderService.cancel(Number(req.params.id))
    res.status(204).end()
  },
}
