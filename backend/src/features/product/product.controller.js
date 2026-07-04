import { productService } from './product.service.js'

export const productController = {
  async list(req, res) {
    res.json(await productService.list())
  },

  async get(req, res) {
    res.json(await productService.get(Number(req.params.id)))
  },

  async create(req, res) {
    res.status(201).json(await productService.create(req.body))
  },

  async update(req, res) {
    res.json(await productService.update(Number(req.params.id), req.body))
  },

  async remove(req, res) {
    await productService.remove(Number(req.params.id))
    res.status(204).end()
  },
}
