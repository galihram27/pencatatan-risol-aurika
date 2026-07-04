import { materialRepository } from './material.repository.js'
import { badRequest, notFound } from '../../lib/errors.js'

export const materialService = {
  list() {
    return materialRepository.findAll()
  },

  async get(id) {
    const material = await materialRepository.findById(id)
    if (!material) throw notFound('Bahan baku')
    return material
  },

  create({ name, stock, unit }) {
    if (!name?.trim()) throw badRequest('Nama bahan baku wajib diisi')
    if (stock == null || Number(stock) < 0) throw badRequest('Stok tidak boleh negatif')
    if (!unit?.trim()) throw badRequest('Satuan wajib diisi')
    return materialRepository.create({
      name: name.trim(),
      stock: Number(stock),
      unit: unit.trim(),
    })
  },

  async update(id, { name, stock, unit }) {
    await this.get(id)
    const data = {}
    if (name !== undefined) {
      if (!name.trim()) throw badRequest('Nama bahan baku tidak boleh kosong')
      data.name = name.trim()
    }
    if (stock !== undefined) {
      if (Number(stock) < 0) throw badRequest('Stok tidak boleh negatif')
      data.stock = Number(stock)
    }
    if (unit !== undefined) {
      if (!unit.trim()) throw badRequest('Satuan tidak boleh kosong')
      data.unit = unit.trim()
    }
    return materialRepository.update(id, data)
  },

  async remove(id) {
    await this.get(id)
    return materialRepository.delete(id)
  },
}
