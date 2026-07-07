<script setup>
import { ref } from 'vue'
import { store } from '../store.js'
import ConfirmDialog from './ConfirmDialog.vue'

const confirmDialog = ref(null)

const deleteCustomer = async (cust) => {
  if (await confirmDialog.value.open(`Yakin ingin menghapus pelanggan "${cust.name}"?`)) {
    store.deleteCustomer(cust.id)
  }
}
</script>

<template>
  <div class="h-full flex flex-col">
    <header class="mb-8">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-800">Data Pelanggan</h2>
      <p class="text-slate-500 mt-1 font-medium">Basis data kustomer yang pernah melakukan Pre-Order.</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 overflow-y-auto pr-2 content-start">
      <div v-for="cust in store.customers" :key="cust.id" class="relative bg-white p-5 rounded-[20px] shadow-sm border border-slate-200 hover:border-orange-200 transition-colors">
        <button @click="deleteCustomer(cust)" title="Hapus pelanggan"
                class="absolute top-4 right-4 w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors">
          <i class="fa-solid fa-trash-can"></i>
        </button>
        <h3 class="font-extrabold text-slate-800 text-lg leading-tight pr-12">{{ cust.name }}</h3>
        <p class="text-sm text-slate-500 font-medium mt-1 mb-3">{{ cust.id }}</p>
        
        <div class="space-y-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <p class="flex items-center gap-2"><i class="fa-solid fa-phone text-slate-400 text-xs w-4"></i> <span class="font-bold">{{ cust.phone }}</span></p>
          <p class="flex items-start gap-2 line-clamp-2"><i class="fa-solid fa-location-dot text-slate-400 text-xs w-4 mt-1"></i> <span>{{ cust.address || '-' }}</span></p>
        </div>
        
        <div class="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Transaksi</span>
          <span class="bg-orange-50 text-orange-600 px-2 py-1 rounded text-xs font-black">{{ cust.orderCount }}x Order</span>
        </div>
      </div>
      
      <div v-if="store.customers.length === 0" class="col-span-full py-20 text-center text-slate-400">
        <i class="fa-solid fa-users-slash text-5xl text-slate-200 mb-4"></i>
        <p class="font-bold">Belum ada data pelanggan tersimpan.</p>
      </div>
    </div>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>