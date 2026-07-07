<script setup>
import { ref } from 'vue'
import { store } from '../store.js'
const paymentMethods = ['Transfer BCA', 'Transfer Mandiri', 'GoPay', 'OVO', 'Cash/Tunai']

const showSuccess = ref(false)
const showError = ref(false)

const handleSubmit = async () => {
  if (await store.submitOrder()) {
    showSuccess.value = true
    setTimeout(() => { showSuccess.value = false }, 2500)
  } else {
    showError.value = true
    setTimeout(() => { showError.value = false }, 3000)
  }
}
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:h-full">
    <div class="flex-1 flex flex-col lg:h-full lg:overflow-hidden">
      <header class="mb-6">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-800">Pilih Menu</h2>
      </header>
      <div class="flex-1 lg:overflow-y-auto pb-4 lg:pb-8 lg:pr-2 grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 content-start">
        <div v-for="product in store.products" :key="product.id" class="group bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
          <div class="h-40 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[20px] mb-4 flex items-center justify-center overflow-hidden">
            <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <i v-else class="fa-solid fa-box-open text-5xl text-orange-200 group-hover:scale-125 group-hover:text-orange-400 transition-all duration-500"></i>
          </div>
          <div class="flex-1 flex flex-col justify-between">
            <div>
              <h3 class="font-extrabold text-lg text-slate-800 leading-tight">{{ product.name }}</h3>
              <p class="text-xs text-slate-500 mt-1 line-clamp-2 font-medium">{{ product.desc }}</p>
            </div>
            <div class="mt-4 flex justify-between items-center">
              <span class="font-black text-orange-600 text-lg">{{ store.formatRupiah(product.price) }}</span>
              <button @click="store.addToCart(product)" class="bg-slate-900 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-orange-500 transition-all duration-200 shadow-md">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full lg:w-[420px] shrink-0 bg-white p-5 sm:p-7 rounded-[32px] shadow-2xl border border-slate-100 flex flex-col lg:h-full z-10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-extrabold text-slate-800">Keranjang</h2>
        <span class="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">{{ store.cart.length }} Item</span>
      </div>
      
      <div class="flex-1 overflow-y-auto pr-2 space-y-3 mb-4 max-h-[45vh] lg:max-h-none">
        <div v-for="item in store.cart" :key="item.id" class="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div class="flex-1">
            <h4 class="font-bold text-slate-800 text-sm mb-0.5">{{ item.name }}</h4>
            <span class="text-sm text-orange-600 font-bold">{{ store.formatRupiah(item.price) }}</span>
          </div>
          <div class="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            <button @click="store.updateQty(item, -1)" class="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-lg"><i class="fa-solid fa-minus text-xs"></i></button>
            <span class="w-6 text-center font-bold text-sm">{{ item.qty }}</span>
            <button @click="store.updateQty(item, 1)" class="w-7 h-7 flex items-center justify-center text-orange-500 hover:bg-orange-50 rounded-lg"><i class="fa-solid fa-plus text-xs"></i></button>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100 pt-4">
        <div class="flex justify-between items-end mb-4">
          <span class="text-slate-500 font-semibold text-sm">Total Tagihan</span>
          <span class="font-black text-2xl text-slate-800">{{ store.formatRupiah(store.cartTotal) }}</span>
        </div>
        
        <div class="space-y-3">
          <div class="relative">
            <input v-model="store.customer.name" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Nama Pelanggan *">
          </div>
          <div class="relative">
            <input v-model="store.customer.phone" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Nomor WhatsApp *">
          </div>
          <div class="relative">
            <input v-model="store.customer.address" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Alamat & Catatan (Opsional)">
          </div>
          
          <!-- Fitur Pilihan Pembayaran Baru -->
          <div class="relative mt-2">
            <select v-model="store.paymentMethod" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none appearance-none text-slate-700 cursor-pointer shadow-sm">
              <option v-for="method in paymentMethods" :key="method" :value="method">{{ method }}</option>
            </select>
            <i class="fa-solid fa-chevron-down absolute right-4 top-4 text-slate-400 text-xs pointer-events-none"></i>
          </div>
          
          <button @click="handleSubmit" class="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-orange-500 transition-all duration-300 mt-2 shadow-lg hover:shadow-orange-500/30">
             Proses Pesanan
          </button>
        </div>
      </div>
    </div>

    <!-- Popup Pesanan Berhasil -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showSuccess" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click="showSuccess = false">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-90"
          enter-to-class="opacity-100 scale-100">
          <div v-if="showSuccess" class="bg-white rounded-3xl shadow-2xl px-10 py-8 flex flex-col items-center text-center max-w-xs mx-4" @click.stop>
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <i class="fa-solid fa-check text-3xl text-green-500"></i>
            </div>
            <h3 class="text-lg font-extrabold text-slate-800">Pesanan berhasil disimpan</h3>
            <p class="text-sm text-slate-500 mt-1 font-medium">Pesanan telah masuk ke daftar pesanan aktif.</p>
            <button @click="showSuccess = false" class="mt-5 bg-slate-900 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-orange-500 transition-colors">
              Tutup
            </button>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Popup Pesanan Gagal -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showError" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click="showError = false">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-90"
          enter-to-class="opacity-100 scale-100">
          <div v-if="showError" class="bg-white rounded-3xl shadow-2xl px-10 py-8 flex flex-col items-center text-center max-w-xs mx-4" @click.stop>
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <i class="fa-solid fa-xmark text-3xl text-red-500"></i>
            </div>
            <h3 class="text-lg font-extrabold text-slate-800">Gagal</h3>
            <p class="text-sm text-slate-500 mt-1 font-medium">Keranjang, Nama, dan No HP wajib diisi!</p>
            <button @click="showError = false" class="mt-5 bg-slate-900 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-orange-500 transition-colors">
              Tutup
            </button>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>