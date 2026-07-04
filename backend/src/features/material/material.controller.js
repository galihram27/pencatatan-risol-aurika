import { materialService } from './material.service.js'

export const materialController = {
  async list(req, res) {
    res.json(await materialService.list())
  },

  async get(req, res) {
    res.json(await materialService.get(Number(req.params.id)))
  },

  async create(req, res) {
    res.status(201).json(await materialService.create(req.body))
  },

  async update(req, res) {
    res.json(await materialService.update(Number(req.params.id), req.body))
  },

  async remove(req, res) {
    await materialService.remove(Number(req.params.id))
    res.status(204).end()
  },
}
