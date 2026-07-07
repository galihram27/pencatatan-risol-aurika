import { productRepository } from './product.repository.js'
import { badRequest, notFound } from '../../lib/errors.js'

export const productService = {
  list() {
    return productRepository.findAll()
  },

  async get(id) {
    const product = await productRepository.findById(id)
    if (!product) throw notFound('Produk')
    return product
  },

  create({ name, price, desc, image }) {
    if (!name?.trim()) throw badRequest('Nama produk wajib diisi')
    if (price == null || Number(price) <= 0) throw badRequest('Harga harus lebih dari 0')
    return productRepository.create({
      name: name.trim(),
      price: Number(price),
      desc: desc?.trim() || null,
      image: image || null,
    })
  },

  async update(id, { name, price, desc, image }) {
    await this.get(id) // memastikan produk ada
    const data = {}
    if (name !== undefined) {
      if (!name.trim()) throw badRequest('Nama produk tidak boleh kosong')
      data.name = name.trim()
    }
    if (price !== undefined) {
      if (Number(price) <= 0) throw badRequest('Harga harus lebih dari 0')
      data.price = Number(price)
    }
    if (desc !== undefined) data.desc = desc?.trim() || null
    if (image !== undefined) data.image = image || null
    return productRepository.update(id, data)
  },

  async remove(id) {
    await this.get(id)
    return productRepository.delete(id)
  },
}
