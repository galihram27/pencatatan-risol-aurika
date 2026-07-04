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
}

main()
  .catch((e) => {
    console.error('❌ Seed gagal:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
