<script setup>
import { ref } from 'vue'
import { store } from '../store.js'
import ConfirmDialog from './ConfirmDialog.vue'

const confirmDialog = ref(null)
const menus = [
  { name: 'Order Input', icon: 'fa-basket-shopping' },
  { name: 'Active Orders', icon: 'fa-fire' },
  { name: 'History', icon: 'fa-clock-rotate-left' },
  { name: 'Kelola Menu', icon: 'fa-layer-group' },
  { name: 'Inventaris Bahan', icon: 'fa-boxes-stacked' },
  { name: 'Data Pelanggan', icon: 'fa-users' },
  { name: 'Laporan Penjualan', icon: 'fa-chart-pie' }
]

async function handleLogout() {
  if (await confirmDialog.value.open('Yakin ingin keluar dari aplikasi?')) store.logout()
}
</script>

<template>
  <!-- Overlay gelap: hanya muncul saat drawer terbuka di mobile -->
  <div v-if="store.sidebarOpen" @click="store.sidebarOpen = false"
       class="fixed inset-0 bg-black/40 z-30 lg:hidden"></div>

  <aside :class="['fixed inset-y-0 left-0 lg:static w-[280px] max-w-[85vw] bg-white flex flex-col justify-between z-40 border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300 ease-out lg:translate-x-0',
                  store.sidebarOpen ? 'translate-x-0' : '-translate-x-full']">
    <div class="flex-1 overflow-y-auto">
      <div class="h-28 flex items-center justify-between px-8 border-b border-slate-100 sticky top-0 bg-white z-10">
        <h1 class="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 shadow-inner">
            <i class="fa-solid fa-book-open text-lg"></i>
          </div>
          Aurika
        </h1>
        <!-- Tombol tutup drawer (mobile) -->
        <button @click="store.sidebarOpen = false" aria-label="Tutup menu"
          class="lg:hidden w-9 h-9 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 flex items-center justify-center transition-colors">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>
      
      <nav class="p-6 space-y-1.5">
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Menu Navigasi</p>
        
        <button v-for="menu in menus" :key="menu.name" @click="store.activeMenu = menu.name; store.sidebarOpen = false"
          :class="['w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ease-out group', 
                   store.activeMenu === menu.name 
                   ? 'bg-orange-500 text-white shadow-[0_8px_20px_rgba(249,115,22,0.3)] translate-x-1' 
                   : 'text-slate-500 hover:bg-orange-50 hover:text-orange-600']">
          
          <div class="flex items-center gap-3.5">
            <i :class="['fa-solid', menu.icon, 'text-lg transition-transform duration-300', store.activeMenu !== menu.name ? 'group-hover:scale-110' : '']"></i>
            {{ menu.name }}
          </div>
          
          <span v-if="menu.name === 'Active Orders' && store.activeOrders.length > 0" 
                :class="['text-[10px] px-2 py-0.5 rounded-full shadow-sm transition-colors', store.activeMenu === menu.name ? 'bg-white text-orange-600' : 'bg-orange-100 text-orange-600']">
            {{ store.activeOrders.length }}
          </span>
        </button>
      </nav>
    </div>
    
    <div class="p-6 border-t border-slate-100 bg-white space-y-3">
      <div v-if="store.currentUser" class="flex items-center gap-3 px-2">
        <div class="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-sm shrink-0">
          {{ (store.currentUser.username || '?').charAt(0).toUpperCase() }}
        </div>
        <div class="min-w-0">
          <p class="text-sm font-bold text-slate-700 truncate">{{ store.currentUser.username }}</p>
        </div>
      </div>
      <button @click="handleLogout"
        class="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold text-slate-500 bg-slate-50 hover:bg-red-50 hover:text-red-500 transition-colors duration-300">
        <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
      </button>
    </div>

    <ConfirmDialog ref="confirmDialog" title="Konfirmasi Logout" icon="fa-arrow-right-from-bracket" />
  </aside>
</template>