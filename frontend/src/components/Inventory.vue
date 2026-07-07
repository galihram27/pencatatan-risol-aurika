<script setup>
import { ref } from 'vue'
import { store } from '../store.js'
import ConfirmDialog from './ConfirmDialog.vue'

const confirmDialog = ref(null)
const form = ref({ id: null, name: '', stock: '', unit: 'Kg' })
const units = ['Kg', 'Gram', 'Liter', 'Ml', 'Pack', 'Pcs']
const isEditing = ref(false)

const deleteMaterial = async (mat) => {
  if (await confirmDialog.value.open(`Yakin ingin menghapus bahan "${mat.name}"?`)) {
    store.deleteMaterial(mat.id)
  }
}

const editItem = (item) => { form.value = { ...item }; isEditing.value = true }
const resetForm = () => { form.value = { id: null, name: '', stock: '', unit: 'Kg' }; isEditing.value = false }
const saveItem = () => {
  if (!form.value.name || !form.value.stock) return alert('Data wajib diisi!')
  store.saveMaterial({ ...form.value, stock: Number(form.value.stock) })
  resetForm()
}
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:h-full">
    <div class="flex-1 lg:overflow-y-auto lg:pr-2 flex flex-col">
      <header class="mb-6">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-800">Inventaris Bahan</h2>
        <p class="text-slate-500 mt-1 font-medium">Pantau stok bahan baku untuk keperluan restock.</p>
      </header>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 content-start">
        <div v-for="mat in store.materials" :key="mat.id" class="bg-white p-5 rounded-[20px] border border-slate-200 shadow-sm flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div :class="['w-12 h-12 rounded-full flex items-center justify-center text-lg shadow-inner', mat.stock < 5 ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400']">
              <i class="fa-solid fa-box"></i>
            </div>
            <div>
              <h3 class="font-bold text-slate-800">{{ mat.name }}</h3>
              <p :class="['text-sm font-black', mat.stock < 5 ? 'text-red-500' : 'text-slate-500']">Sisa: {{ mat.stock }} {{ mat.unit }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="editItem(mat)" class="w-8 h-8 bg-slate-50 text-slate-600 rounded-lg hover:bg-blue-50 hover:text-blue-500"><i class="fa-solid fa-pen text-xs"></i></button>
            <button @click="deleteMaterial(mat)" title="Hapus bahan" class="w-8 h-8 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 flex items-center justify-center transition-colors"><i class="fa-solid fa-trash-can text-xs"></i></button>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Input Bahan -->
    <div class="w-full lg:w-[360px] shrink-0 bg-white p-5 sm:p-7 rounded-[32px] shadow-2xl border border-slate-100 h-fit">
      <h2 class="text-xl font-extrabold text-slate-800 mb-6 border-b border-slate-100 pb-4">{{ isEditing ? 'Edit Bahan' : 'Tambah Bahan' }}</h2>
      <div class="space-y-4">
        <div>
          <label class="text-[10px] font-bold text-slate-400 uppercase">Nama Bahan *</label>
          <input v-model="form.name" type="text" class="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none">
        </div>
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase">Jumlah *</label>
            <input v-model="form.stock" type="number" class="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none">
          </div>
          <div class="w-1/3">
            <label class="text-[10px] font-bold text-slate-400 uppercase">Satuan</label>
            <select v-model="form.unit" class="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-3 text-sm font-bold outline-none cursor-pointer">
              <option v-for="u in units" :key="u">{{ u }}</option>
            </select>
          </div>
        </div>
        <div class="pt-4 flex gap-2">
          <button v-if="isEditing" @click="resetForm" class="w-1/3 bg-slate-100 text-slate-500 font-bold py-3 rounded-xl hover:bg-slate-200">Batal</button>
          <button @click="saveItem" class="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-orange-500 transition-colors">Simpan Stok</button>
        </div>
      </div>
    </div>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>