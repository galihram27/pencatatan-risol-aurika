import { customerRepository } from './customer.repository.js'
import { badRequest, notFound } from '../../lib/errors.js'

export const customerService = {
  list() {
    return customerRepository.findAll()
  },

  async get(id) {
    const customer = await customerRepository.findById(id)
    if (!customer) throw notFound('Pelanggan')
    return customer
  },

  create({ name, phone, address }) {
    if (!name?.trim()) throw badRequest('Nama pelanggan wajib diisi')
    if (!phone?.trim()) throw badRequest('No HP pelanggan wajib diisi')
    return customerRepository.create({
      name: name.trim(),
      phone: phone.trim(),
      address: address?.trim() || null,
    })
  },

  async update(id, { name, phone, address }) {
    await this.get(id)
    const data = {}
    if (name !== undefined) {
      if (!name.trim()) throw badRequest('Nama pelanggan tidak boleh kosong')
      data.name = name.trim()
    }
    if (phone !== undefined) {
      if (!phone.trim()) throw badRequest('No HP tidak boleh kosong')
      data.phone = phone.trim()
    }
    if (address !== undefined) data.address = address?.trim() || null
    return customerRepository.update(id, data)
  },

  async remove(id) {
    await this.get(id)
    return customerRepository.delete(id)
  },

  // Cari pelanggan by phone; jika belum ada, buat baru. Dipakai saat input pesanan.
  async upsertByPhone({ name, phone, address }) {
    const existing = await customerRepository.findByPhone(phone.trim())
    if (existing) {
      // Perbarui alamat bila ada info baru
      if (address?.trim() && address.trim() !== existing.address) {
        return customerRepository.update(existing.id, { address: address.trim() })
      }
      return existing
    }
    return customerRepository.create({
      name: name.trim(),
      phone: phone.trim(),
      address: address?.trim() || null,
    })
  },
}
