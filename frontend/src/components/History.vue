<script setup>
import { store } from '../store.js'
</script>

<template>
  <div class="h-full flex flex-col">
    <header class="mb-8 flex justify-between items-end">
      <div>
        <h2 class="text-3xl font-extrabold text-slate-800">Riwayat Selesai</h2>
        <p class="text-slate-500 mt-1 font-medium">Arsip transaksi yang telah berhasil diselesaikan.</p>
      </div>
      <div class="bg-green-50 px-4 py-2 rounded-xl border border-green-100">
        <span class="text-green-600 font-bold text-sm">{{ store.completedOrders.length }} Transaksi Berhasil</span>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-8 pr-2 content-start">
      <div v-for="order in store.completedOrders" :key="order.id" 
           class="bg-white p-6 rounded-[24px] shadow-sm border border-slate-200/60 flex flex-col opacity-75 hover:opacity-100 transition-opacity duration-300">
        
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-extrabold text-lg text-slate-700">{{ order.customer.name }}</h3>
            <p class="text-xs font-bold text-slate-400 mt-1">{{ order.date }}</p>
          </div>
          <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
            <i class="fa-solid fa-check-double text-sm"></i>
          </div>
        </div>
        
        <div class="mt-2 p-4 rounded-xl bg-slate-50 border border-slate-100 mb-6 flex-1">
          <ul class="space-y-1.5">
            <li v-for="item in order.items" :key="item.id" class="text-sm font-semibold text-slate-600 flex justify-between">
              <span>{{ item.name }}</span>
              <span class="text-slate-400">x{{ item.qty }}</span>
            </li>
          </ul>
        </div>

        <div class="flex justify-between items-center border-t border-slate-100 pt-4">
           <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pendapatan</span>
           <span class="font-black text-green-600 text-xl">{{ store.formatRupiah(order.total) }}</span>
        </div>
      </div>

      <div v-if="store.completedOrders.length === 0" class="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
        <i class="fa-solid fa-box-archive text-5xl mb-4 text-slate-300"></i>
        <p class="text-lg font-bold text-slate-500">Belum ada riwayat.</p>
      </div>
    </div>
  </div>
</template>