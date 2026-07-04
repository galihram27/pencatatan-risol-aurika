import { reactive, watch } from 'vue'

// Alamat API backend. Bisa dioverride lewat VITE_API_URL saat build/dev.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const TOKEN_KEY = 'aurika_token'
const USER_KEY = 'aurika_user'

// Kunci & field data yang dipersist ke localStorage agar tidak hilang saat refresh.
const DATA_KEY = 'aurika_data'
const PERSISTED_KEYS = ['products', 'materials', 'customers', 'orders']

export const store = reactive({
  activeMenu: 'Order Input',

  // --- AUTENTIKASI ---
  // Token & user dibaca dari localStorage agar owner tidak perlu login ulang.
  token: localStorage.getItem(TOKEN_KEY) || '',
  currentUser: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
  authLoading: false,
  authError: '',

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
      } else if (res.ok) {
        this.currentUser = await res.json()
        localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser))
      }
      // Error jaringan lain: biarkan sesi tetap ada agar tetap bisa dipakai offline.
    } catch {
      /* abaikan: jangan paksa logout hanya karena server sedang tidak terjangkau */
    }
  },


  products: [
    { id: 1, name: 'Choco Cheese', price: 5000, desc: 'Risol cokelat & keju lumer.' },
    { id: 2, name: 'Smoke Beef Mayo', price: 5000, desc: 'Daging asap, telur, keju & mayo.' },
    { id: 3, name: 'Spicy Chicken', price: 5000, desc: 'Ayam suwir bumbu pedas.' },
    { id: 4, name: 'Creamy Mushroom Smoke Beef', price: 9000, desc: 'Jamur creamy & daging asap.' }
  ],
  
  materials: [
    { id: 1, name: 'Tepung Terigu Premium', stock: 5, unit: 'Kg' },
    { id: 2, name: 'Daging Asap', stock: 15, unit: 'Pack' },
    { id: 3, name: 'Mayones', stock: 4, unit: 'Liter' }
  ],
  
  customers: [],
  cart: [],
  customer: { name: '', phone: '', address: '', note: '' },
  paymentMethod: 'Transfer BCA',
  orders: [],

  // Getters
  get activeOrders() { return this.orders.filter(o => o.status === 'Pending') },
  get completedOrders() { return this.orders.filter(o => o.status === 'Completed') },
  get cartTotal() { return this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0) },
  get totalRevenue() { return this.completedOrders.reduce((sum, order) => sum + order.total, 0) },

  formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
  },

  // --- KELOLA PRODUK ---
  saveProduct(product) {
    if (product.id) {
      const index = this.products.findIndex(p => p.id === product.id)
      if (index !== -1) Object.assign(this.products[index], product)
    } else this.products.push({ ...product, id: Date.now() })
  },
  deleteProduct(id) {
    this.products = this.products.filter(p => p.id !== id)
    this.cart = this.cart.filter(item => item.id !== id)
  },

  // --- KELOLA INVENTARIS BAHAN BAKU ---
  saveMaterial(material) {
    if (material.id) {
      const index = this.materials.findIndex(m => m.id === material.id)
      if (index !== -1) Object.assign(this.materials[index], material)
    } else this.materials.push({ ...material, id: Date.now() })
  },
  deleteMaterial(id) {
    this.materials = this.materials.filter(m => m.id !== id)
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

  submitOrder() {
    if (this.cart.length === 0 || !this.customer.name || !this.customer.phone) {
      return false
    }

    // Auto-save ke Customer Directory
    let existingCust = this.customers.find(c => c.phone === this.customer.phone)
    if (!existingCust) {
      this.customers.push({ id: `CUST-${Date.now()}`, ...this.customer, orderCount: 1 })
    } else {
      existingCust.orderCount++
      if (this.customer.address) existingCust.address = this.customer.address
    }

    this.orders.push({
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleString('id-ID'),
      customer: { ...this.customer },
      items: JSON.parse(JSON.stringify(this.cart)),
      total: this.cartTotal,
      status: 'Pending',
      paymentMethod: this.paymentMethod,
      paymentStatus: 'Belum Lunas'
    })
    
    this.cart = []
    this.customer = { name: '', phone: '', address: '', note: '' }
    this.paymentMethod = 'Transfer BCA'
    return true
  },

  // --- MANAJEMEN PESANAN AKTIF ---
  verifyPayment(orderId) {
    const order = this.orders.find(o => o.id === orderId)
    if (order) order.paymentStatus = 'Lunas'
  },
  markAsDone(orderId) {
    const order = this.orders.find(o => o.id === orderId)
    if (order) {
      if (order.paymentStatus !== 'Lunas') return alert('Pesanan tidak bisa diselesaikan karena BELUM LUNAS!')
      order.status = 'Completed'
      order.completedDate = new Date().toLocaleString('id-ID')
    }
  },
  cancelOrder(orderId) {
    this.orders = this.orders.filter(o => o.id !== orderId)
  },

  // Pilih pelanggan dari Customer Directory
  selectCustomer(cust) {
    this.customer = { name: cust.name, phone: cust.phone, address: cust.address, note: '' }
  },

  // Hapus pelanggan dari direktori
  deleteCustomer(id) {
    this.customers = this.customers.filter(c => c.id !== id)
  }
})

// --- PERSISTENSI DATA (localStorage) ---
// Muat data tersimpan saat aplikasi dibuka, timpa nilai default bila ada.
try {
  const saved = JSON.parse(localStorage.getItem(DATA_KEY) || 'null')
  if (saved) {
    for (const key of PERSISTED_KEYS) {
      if (Array.isArray(saved[key])) store[key] = saved[key]
    }
  }
} catch {
  /* abaikan data rusak: pakai nilai default */
}

// Simpan otomatis setiap kali data berubah.
watch(
  () => PERSISTED_KEYS.map(key => store[key]),
  () => {
    const data = {}
    for (const key of PERSISTED_KEYS) data[key] = store[key]
    localStorage.setItem(DATA_KEY, JSON.stringify(data))
  },
  { deep: true }
)