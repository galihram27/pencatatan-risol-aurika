import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// Seed hanya membuat/memastikan satu akun owner. Aplikasi ini single-owner,
// jadi tidak ada halaman register — akun dibuat lewat file ini.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// Kredensial diambil dari .env agar tidak hard-code. Ada nilai default aman untuk dev.
const username = (process.env.SEED_USERNAME || 'admin').trim()
const plainPassword = process.env.SEED_PASSWORD || 'admin123'
const role = process.env.SEED_ROLE || 'owner'

async function main() {
  const password = await bcrypt.hash(plainPassword, 10)

  // upsert: jika username sudah ada, perbarui password/role; jika belum, buat baru.
  const user = await prisma.user.upsert({
    where: { username },
    update: { password, role },
    create: { username, password, role },
  })

  console.log('✅ Akun siap dipakai login:')
  console.log(`   username : ${user.username}`)
  console.log(`   password : ${plainPassword}`)
  console.log(`   role     : ${user.role}`)
  console.log('⚠️  Ganti password default ini untuk penggunaan nyata.')

  // Katalog awal — hanya diisi bila tabel masih kosong, agar re-seed tidak menduplikasi.
  if ((await prisma.product.count()) === 0) {
    await prisma.product.createMany({
      data: [
        { name: 'Choco Cheese', price: 5000, desc: 'Risol cokelat & keju lumer.' },
        { name: 'Smoke Beef Mayo', price: 5000, desc: 'Daging asap, telur, keju & mayo.' },
        { name: 'Spicy Chicken', price: 5000, desc: 'Ayam suwir bumbu pedas.' },
        { name: 'Creamy Mushroom Smoke Beef', price: 9000, desc: 'Jamur creamy & daging asap.' },
      ],
    })
    console.log('✅ Produk awal ditambahkan.')
  }

  if ((await prisma.material.count()) === 0) {
    await prisma.material.createMany({
      data: [
        { name: 'Tepung Terigu Premium', stock: 5, unit: 'Kg' },
        { name: 'Daging Asap', stock: 15, unit: 'Pack' },
        { name: 'Mayones', stock: 4, unit: 'Liter' },
      ],
    })
    console.log('✅ Bahan baku awal ditambahkan.')
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed gagal:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
