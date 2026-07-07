import { reactive } from 'vue'

// Alamat API backend. Bisa dioverride lewat VITE_API_URL saat build/dev.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const TOKEN_KEY = 'aurika_token'
const USER_KEY = 'aurika_user'

// Helper fetch terpusat: menempelkan token, header JSON, & penanganan error seragam.
// Semua data kini disimpan di server (database), bukan localStorage, agar konsisten
// di semua perangkat/pengguna.
async function apiFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) }
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (store.token) headers['Authorization'] = `Bearer ${store.token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })

  // Token kedaluwarsa / tidak valid → paksa login ulang.
  if (res.status === 401) {
    store.logout()
    throw new Error('Sesi berakhir. Silakan login ulang.')
  }
  if (res.status === 204) return null

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan pada server.')
  return data
}

// --- NORMALISASI BENTUK DATA SERVER → BENTUK YANG DIPAKAI UI ---
// Pesanan: server menyimpan snapshot pelanggan sebagai field datar; UI memakai objek `customer`.
function normalizeOrder(o) {
  return {
    id: o.id,
    date: new Date(o.date).toLocaleString('id-ID'),
    completedDate: o.completedDate ? new Date(o.completedDate).toLocaleString('id-ID') : null,
    total: o.total,
    status: o.status,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    customer: {
      name: o.customerName,
      phone: o.customerPhone,
      address: o.customerAddress || '',
      note: o.customerNote || '',
    },
    items: o.items || [],
  }
}

// Pelanggan: orderCount dihitung server via _count relasi orders.
function normalizeCustomer(c) {
  return {
    id: c.id,
    name: c.name,
    phone: c.phone,
    address: c.address || '',
    orderCount: c._count?.orders ?? 0,
  }
}

export const store = reactive({
  activeMenu: 'Order Input',

  // --- AUTENTIKASI ---
  // Token & user dibaca dari localStorage agar owner tidak perlu login ulang.
  token: localStorage.getItem(TOKEN_KEY) || '',
  currentUser: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
  authLoading: false,
  authError: '',

  // Status pemuatan data dari server.
  dataLoading: false,
  dataError: '',

  get isAuthenticated() {
    return !!this.token
  },

  async login(username, password) {
    this.authLoading = true
    this.authError = ''
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        this.authError = data.message || 'Gagal login. Coba lagi.'
        return false
      }
      this.token = data.token
      this.currentUser = data.user
      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      await this.loadAll()
      return true
    } catch {
      this.authError = 'Tidak dapat terhubung ke server.'
      return false
    } finally {
      this.authLoading = false
    }
  },

  logout() {
    this.token = ''
    this.currentUser = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    this.activeMenu = 'Order Input'
    // Kosongkan data di memori agar tidak bocor ke sesi berikutnya.
    this.products = []
    this.materials = []
    this.customers = []
    this.orders = []
    this.cart = []
  },

  // Verifikasi token tersimpan saat aplikasi dibuka; logout otomatis bila kedaluwarsa.
  async verifySession() {
    if (!this.token) return
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      if (res.status === 401) {
        this.logout()
        return
      }
      if (res.ok) {
        this.currentUser = await res.json()
        localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser))
        await this.loadAll()
      }
      // Error jaringan lain: biarkan sesi tetap ada agar tetap bisa dipakai offline.
    } catch {
      /* abaikan: jangan paksa logout hanya karena server sedang tidak terjangkau */
    }
  },

  // --- DATA (dimuat dari server) ---
  products: [],
  materials: [],
  customers: [],
  orders: [],

  cart: [],
  customer: { name: '', phone: '', address: '', note: '' },
  paymentMethod: 'Transfer BCA',

  // Getters
  get activeOrders() { return this.orders.filter(o => o.status === 'Pending') },
  get completedOrders() { return this.orders.filter(o => o.status === 'Completed') },
  get cartTotal() { return this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0) },
  get totalRevenue() { return this.completedOrders.reduce((sum, order) => sum + order.total, 0) },

  formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
  },

  // --- PEMUATAN DATA ---
  async loadProducts() { this.products = await apiFetch('/api/products') },
  async loadMaterials() { this.materials = await apiFetch('/api/materials') },
  async loadCustomers() { this.customers = (await apiFetch('/api/customers')).map(normalizeCustomer) },
  async loadOrders() { this.orders = (await apiFetch('/api/orders')).map(normalizeOrder) },

  async loadAll() {
    this.dataLoading = true
    this.dataError = ''
    try {
      await Promise.all([this.loadProducts(), this.loadMaterials(), this.loadCustomers(), this.loadOrders()])
    } catch (e) {
      this.dataError = e.message
    } finally {
      this.dataLoading = false
    }
  },

  // --- KELOLA PRODUK ---
  async saveProduct(product) {
    const body = {
      name: product.name,
      price: Number(product.price),
      desc: product.desc,
      image: product.image || null,
    }
    try {
      if (product.id) {
        await apiFetch(`/api/products/${product.id}`, { method: 'PUT', body: JSON.stringify(body) })
      } else {
        await apiFetch('/api/products', { method: 'POST', body: JSON.stringify(body) })
      }
      await this.loadProducts()
    } catch (e) {
      alert(e.message)
    }
  },
  async deleteProduct(id) {
    try {
      await apiFetch(`/api/products/${id}`, { method: 'DELETE' })
      this.cart = this.cart.filter(item => item.id !== id)
      await this.loadProducts()
    } catch (e) {
      alert(e.message)
    }
  },

  // --- KELOLA INVENTARIS BAHAN BAKU ---
  async saveMaterial(material) {
    const body = { name: material.name, stock: Number(material.stock), unit: material.unit }
    try {
      if (material.id) {
        await apiFetch(`/api/materials/${material.id}`, { method: 'PUT', body: JSON.stringify(body) })
      } else {
        await apiFetch('/api/materials', { method: 'POST', body: JSON.stringify(body) })
      }
      await this.loadMaterials()
    } catch (e) {
      alert(e.message)
    }
  },
  async deleteMaterial(id) {
    try {
      await apiFetch(`/api/materials/${id}`, { method: 'DELETE' })
      await this.loadMaterials()
    } catch (e) {
      alert(e.message)
    }
  },

  // --- TRANSAKSI & KERANJANG ---
  addToCart(product) {
    const existing = this.cart.find(i => i.id === product.id)
    if (existing) existing.qty++
    else this.cart.push({ ...product, qty: 1 })
  },
  updateQty(item, amount) {
    item.qty += amount
    if (item.qty <= 0) this.cart = this.cart.filter(i => i.id !== item.id)
  },

  async submitOrder() {
    if (this.cart.length === 0 || !this.customer.name || !this.customer.phone) {
      return false
    }
    try {
      await apiFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          customer: { ...this.customer },
          items: this.cart.map(i => ({ productId: i.id, qty: i.qty })),
          paymentMethod: this.paymentMethod,
        }),
      })
      this.cart = []
      this.customer = { name: '', phone: '', address: '', note: '' }
      this.paymentMethod = 'Transfer BCA'
      // Pesanan baru juga bisa membuat/menaikkan pelanggan → segarkan keduanya.
      await Promise.all([this.loadOrders(), this.loadCustomers()])
      return true
    } catch (e) {
      alert(e.message)
      return false
    }
  },

  // --- MANAJEMEN PESANAN AKTIF ---
  async verifyPayment(orderId) {
    try {
      await apiFetch(`/api/orders/${orderId}/verify-payment`, { method: 'PATCH' })
      await this.loadOrders()
    } catch (e) {
      alert(e.message)
    }
  },
  async markAsDone(orderId) {
    const order = this.orders.find(o => o.id === orderId)
    if (order && order.paymentStatus !== 'Lunas') {
      return alert('Pesanan tidak bisa diselesaikan karena BELUM LUNAS!')
    }
    try {
      await apiFetch(`/api/orders/${orderId}/complete`, { method: 'PATCH' })
      await this.loadOrders()
    } catch (e) {
      alert(e.message)
    }
  },
  async cancelOrder(orderId) {
    try {
      await apiFetch(`/api/orders/${orderId}`, { method: 'DELETE' })
      await this.loadOrders()
    } catch (e) {
      alert(e.message)
    }
  },

  // Pilih pelanggan dari Customer Directory
  selectCustomer(cust) {
    this.customer = { name: cust.name, phone: cust.phone, address: cust.address, note: '' }
  },

  // Hapus pelanggan dari direktori
  async deleteCustomer(id) {
    try {
      await apiFetch(`/api/customers/${id}`, { method: 'DELETE' })
      await this.loadCustomers()
    } catch (e) {
      alert(e.message)
    }
  },
})
