import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import authRoutes from './features/auth/auth.routes.js'
import productRoutes from './features/product/product.routes.js'
import materialRoutes from './features/material/material.routes.js'
import customerRoutes from './features/customer/customer.routes.js'
import orderRoutes from './features/order/order.routes.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { requireAuth } from './middlewares/requireAuth.js'

const app = express()

app.use(cors())
// Batas payload dinaikkan agar muat gambar produk base64 (maks ~2MB → ~2.7MB encoded).
app.use(express.json({ limit: '5mb' }))

// Health check
app.get('/', (req, res) => res.json({ status: 'ok', service: 'Risol Aurika API' }))

// Feature routes
// Auth terbuka (login). Rute data dilindungi requireAuth — hanya owner yang sudah login.
app.use('/api/auth', authRoutes)
app.use('/api/products', requireAuth, productRoutes)
app.use('/api/materials', requireAuth, materialRoutes)
app.use('/api/customers', requireAuth, customerRoutes)
app.use('/api/orders', requireAuth, orderRoutes)

// 404 & error handling
app.use((req, res) => res.status(404).json({ message: 'Endpoint tidak ditemukan' }))
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`))

export default app
