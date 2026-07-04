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
    <main class="flex-1 p-8 overflow-hidden relative">
      <OrderInput v-if="store.activeMenu === 'Order Input'" />
      <ActiveOrders v-else-if="store.activeMenu === 'Active Orders'" />
      <History v-else-if="store.activeMenu === 'History'" />
      <MenuManagement v-else-if="store.activeMenu === 'Kelola Menu'" />
      <Inventory v-else-if="store.activeMenu === 'Inventaris Bahan'" />
      <Customers v-else-if="store.activeMenu === 'Data Pelanggan'" />
      <Reports v-else-if="store.activeMenu === 'Laporan Penjualan'" />
    </main>
  </div>
</template>