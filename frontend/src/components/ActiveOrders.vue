<script setup>
import { ref } from 'vue'
import { store } from '../store.js'
import ConfirmDialog from './ConfirmDialog.vue'

const confirmDialog = ref(null)

const cancelOrder = async (order) => {
  if (await confirmDialog.value.open(`Yakin ingin membatalkan pesanan "${order.customer.name}"?`)) {
    store.cancelOrder(order.id)
  }
}
</script>

<template>
  <div class="h-full flex flex-col">
    <header class="mb-8">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-800">Active Orders</h2>
      <p class="text-slate-500 mt-1 font-medium">Lakukan verifikasi pembayaran dan proses pesanan dapur.</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-8 pr-2 content-start">
      <div v-for="order in store.activeOrders" :key="order.id" class="bg-white p-6 rounded-[24px] shadow-sm border border-slate-200 flex flex-col relative group">
        
        <div class="flex justify-between items-start mb-4">
          <div>
            <span class="text-[10px] font-black text-slate-400 block mb-1">{{ order.id }}</span>
            <h3 class="font-extrabold text-lg text-slate-800 leading-none">{{ order.customer.name }}</h3>
            <p class="text-xs font-bold text-slate-500 mt-1.5"><i class="fa-solid fa-phone text-green-500 mr-1"></i> {{ order.customer.phone }}</p>
          </div>
          <!-- Status Pembayaran Badge -->
          <div :class="['px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border', order.paymentStatus === 'Lunas' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-500 border-red-200']">
            {{ order.paymentStatus }}
          </div>
        </div>
        
        <div class="text-sm text-slate-600 space-y-3 mb-5 flex-1">
          <p class="text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
            <i class="fa-solid fa-wallet mr-1 text-slate-400"></i> {{ order.paymentMethod }}
          </p>
          <div class="mt-2">
            <ul class="space-y-1.5">
              <li v-for="item in order.items" :key="item.id" class="flex items-center gap-2 font-bold text-slate-700 text-sm">
                <span class="bg-orange-100 text-orange-600 w-5 h-5 rounded flex items-center justify-center text-xs">{{ item.qty }}</span> 
                {{ item.name }}
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-slate-100 pt-4 mb-4 flex justify-between items-center">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Tagihan</p>
          <p class="font-black text-slate-800 text-xl">{{ store.formatRupiah(order.total) }}</p>
        </div>

        <!-- Tombol Aksi Baru -->
        <div class="flex gap-2">
          <button @click="cancelOrder(order)" class="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors">
            <i class="fa-solid fa-trash-can"></i>
          </button>
          
          <button v-if="order.paymentStatus === 'Belum Lunas'" @click="store.verifyPayment(order.id)" class="flex-1 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors shadow-sm">
             Verifikasi Lunas
          </button>
          
          <button v-else @click="store.markAsDone(order.id)" class="flex-1 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
            <i class="fa-solid fa-check-double"></i> Selesai
          </button>
        </div>
      </div>

      <div v-if="store.activeOrders.length === 0" class="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
        <i class="fa-solid fa-mug-hot text-5xl text-slate-200 mb-4"></i>
        <p class="text-lg font-bold text-slate-500">Antrean dapur kosong.</p>
      </div>
    </div>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>