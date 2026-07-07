<script setup>
import { onMounted } from 'vue'
import { store } from './store.js'
import Login from './components/Login.vue'
import Sidebar from './components/Sidebar.vue'
import OrderInput from './components/OrderInput.vue'
import ActiveOrders from './components/ActiveOrders.vue'
import History from './components/History.vue'
import MenuManagement from './components/MenuManagement.vue'
import Inventory from './components/Inventory.vue'
import Customers from './components/Customers.vue'
import Reports from './components/Reports.vue'

// Saat aplikasi dibuka, cek apakah token tersimpan masih valid.
onMounted(() => store.verifySession())
</script>

<template>
  <!-- Belum login: tampilkan halaman login sebagai halaman pertama -->
  <Login v-if="!store.isAuthenticated" />

  <!-- Sudah login: tampilkan aplikasi -->
  <div v-else class="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800 selection:bg-orange-200">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-hidden min-w-0">
      <!-- Top bar khusus mobile: tombol menu + judul halaman aktif -->
      <header class="lg:hidden flex items-center gap-3 h-16 px-4 bg-white border-b border-slate-200 shrink-0 z-10">
        <button @click="store.sidebarOpen = true" aria-label="Buka menu"
          class="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 transition-colors">
          <i class="fa-solid fa-bars text-lg"></i>
        </button>
        <div class="flex items-center gap-2 min-w-0">
          <div class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500 shrink-0">
            <i class="fa-solid fa-book-open text-sm"></i>
          </div>
          <span class="font-extrabold text-base text-slate-800 truncate">{{ store.activeMenu }}</span>
        </div>
      </header>

      <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto lg:overflow-hidden relative">
        <OrderInput v-if="store.activeMenu === 'Order Input'" />
        <ActiveOrders v-else-if="store.activeMenu === 'Active Orders'" />
        <History v-else-if="store.activeMenu === 'History'" />
        <MenuManagement v-else-if="store.activeMenu === 'Kelola Menu'" />
        <Inventory v-else-if="store.activeMenu === 'Inventaris Bahan'" />
        <Customers v-else-if="store.activeMenu === 'Data Pelanggan'" />
        <Reports v-else-if="store.activeMenu === 'Laporan Penjualan'" />
      </main>
    </div>
  </div>
</template>