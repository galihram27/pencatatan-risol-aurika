<script setup>
import { computed } from 'vue'
import { store } from '../store.js'

const totalRevenue = computed(() => store.totalRevenue)
const totalOrders = computed(() => store.completedOrders.length)

// Menghitung produk terlaris
const itemStats = computed(() => {
  const stats = {}
  store.completedOrders.forEach(order => {
    order.items.forEach(item => {
      if (!stats[item.name]) stats[item.name] = { qty: 0, revenue: 0 }
      stats[item.name].qty += item.qty
      stats[item.name].revenue += (item.qty * item.price)
    })
  })
  return Object.entries(stats).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.qty - a.qty)
})
</script>

<template>
  <div class="h-full flex flex-col">
    <header class="mb-8">
      <h2 class="text-3xl font-extrabold text-slate-800">Laporan Penjualan</h2>
      <p class="text-slate-500 mt-1 font-medium">Ringkasan analitik dan rekapitulasi pendapatan otomatis.</p>
    </header>

    <!-- Top KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-[24px] shadow-xl text-white flex items-center justify-between">
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pendapatan (Kotor)</p>
          <h3 class="text-4xl font-black">{{ store.formatRupiah(totalRevenue) }}</h3>
        </div>
        <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md text-2xl"><i class="fa-solid fa-chart-line text-green-400"></i></div>
      </div>
      
      <div class="bg-white p-6 rounded-[24px] shadow-sm border border-slate-200 flex items-center justify-between">
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pesanan Sukses</p>
          <h3 class="text-4xl font-black text-slate-800">{{ totalOrders }} <span class="text-lg text-slate-400 font-medium">Transaksi</span></h3>
        </div>
        <div class="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 text-2xl"><i class="fa-solid fa-clipboard-check"></i></div>
      </div>
    </div>

    <!-- Product Analytics Table -->
    <div class="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
      <div class="px-6 py-5 border-b border-slate-100">
        <h3 class="font-extrabold text-slate-800 text-lg">Analitik Produk Terjual</h3>
      </div>
      <div class="flex-1 overflow-y-auto">
        <table class="w-full text-left">
          <thead class="bg-slate-50/50 sticky top-0">
            <tr>
              <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Varian Risol</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Total Terjual</th>
              <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Pendapatan Item</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(stat, index) in itemStats" :key="index" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 font-bold text-slate-800">{{ stat.name }}</td>
              <td class="px-6 py-4 text-center">
                <span class="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg font-black text-xs">{{ stat.qty }} pcs</span>
              </td>
              <td class="px-6 py-4 font-black text-slate-800 text-right">{{ store.formatRupiah(stat.revenue) }}</td>
            </tr>
            <tr v-if="itemStats.length === 0">
              <td colspan="3" class="px-6 py-12 text-center text-slate-400 font-medium">Belum ada data penjualan yang terekam.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>