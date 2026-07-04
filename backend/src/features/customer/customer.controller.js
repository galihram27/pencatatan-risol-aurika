import { customerService } from './customer.service.js'

export const customerController = {
  async list(req, res) {
    res.json(await customerService.list())
  },

  async get(req, res) {
    res.json(await customerService.get(Number(req.params.id)))
  },

  async create(req, res) {
    res.status(201).json(await customerService.create(req.body))
  },

  async update(req, res) {
    res.json(await customerService.update(Number(req.params.id), req.body))
  },

  async remove(req, res) {
    await customerService.remove(Number(req.params.id))
    res.status(204).end()
  },
}
