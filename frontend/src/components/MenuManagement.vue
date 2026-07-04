<script setup>
import { ref } from 'vue'
import { store } from '../store.js'
import ConfirmDialog from './ConfirmDialog.vue'

const confirmDialog = ref(null)

const form = ref({ id: null, name: '', price: '', desc: '', image: '' })
const isEditing = ref(false)
const fileInput = ref(null)

const editItem = (item) => {
  form.value = { image: '', ...item }
  isEditing.value = true
}

const resetForm = () => {
  form.value = { id: null, name: '', price: '', desc: '', image: '' }
  isEditing.value = false
  if (fileInput.value) fileInput.value.value = ''
}

const onImageChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) return alert('File harus berupa gambar!')
  if (file.size > 2 * 1024 * 1024) return alert('Ukuran gambar maksimal 2MB!')
  const reader = new FileReader()
  reader.onload = () => { form.value.image = reader.result }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  form.value.image = ''
  if (fileInput.value) fileInput.value.value = ''
}

const saveItem = () => {
  if (!form.value.name || !form.value.price) return alert('Nama dan Harga wajib diisi!')
  store.saveProduct({ ...form.value, price: Number(form.value.price) })
  resetForm()
}

const deleteItem = async (id) => {
  if (await confirmDialog.value.open('Yakin ingin menghapus varian risol ini?')) store.deleteProduct(id)
}
</script>

<template>
  <div class="flex gap-8 h-full">
    
    <!-- Daftar Menu -->
    <div class="flex-1 overflow-y-auto pr-2 flex flex-col">
      <header class="mb-6">
        <h2 class="text-3xl font-extrabold text-slate-800">Katalog Master</h2>
        <p class="text-slate-500 mt-1 font-medium">Kelola ketersediaan varian menu Anda di sini.</p>
      </header>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 content-start">
        <div v-for="product in store.products" :key="product.id"
             class="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-lg hover:border-orange-100 transition-all">
          <div class="flex gap-4">
            <div class="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 overflow-hidden shrink-0">
              <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-cover">
              <i v-else class="fa-solid fa-image text-2xl"></i>
            </div>
            <div class="flex-1">
              <h3 class="font-extrabold text-lg text-slate-800 leading-none mb-1">{{ product.name }}</h3>
              <p class="text-orange-500 font-black mb-2">{{ store.formatRupiah(product.price) }}</p>
              <p class="text-xs text-slate-500 line-clamp-2 font-medium">{{ product.desc }}</p>
            </div>
          </div>
          <div class="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button @click="editItem(product)" title="Edit varian" class="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-500 flex items-center justify-center transition-colors">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button @click="deleteItem(product.id)" title="Hapus varian" class="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Tambah/Edit -->
    <div class="w-[420px] bg-white p-7 rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-slate-100 h-fit">
      <div class="flex items-center gap-3 mb-6 border-b border-slate-100 pb-5">
        <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg', isEditing ? 'bg-blue-500 shadow-blue-500/30' : 'bg-orange-500 shadow-orange-500/30']">
          <i :class="isEditing ? 'fa-solid fa-pen' : 'fa-solid fa-plus'"></i>
        </div>
        <h2 class="text-xl font-extrabold text-slate-800">{{ isEditing ? 'Edit Varian' : 'Tambah Varian' }}</h2>
      </div>
      
      <div class="space-y-4">
        <!-- Upload / Edit Gambar -->
        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Gambar Menu</label>
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onImageChange">
          <div v-if="form.image" class="flex items-center gap-3">
            <img :src="form.image" alt="Preview" class="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0">
            <div class="flex gap-2">
              <button type="button" @click="fileInput.click()" class="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors">
                <i class="fa-solid fa-arrows-rotate mr-1"></i>Ganti
              </button>
              <button type="button" @click="removeImage" class="bg-red-50 text-red-500 text-xs font-bold px-3 py-2 rounded-lg hover:bg-red-100 transition-colors">
                <i class="fa-solid fa-trash mr-1"></i>Hapus
              </button>
            </div>
          </div>
          <button v-else type="button" @click="fileInput.click()"
                  class="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 py-3 text-slate-400 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/40 transition-all">
            <i class="fa-solid fa-cloud-arrow-up text-lg"></i>
            <span class="text-sm font-bold">Upload Gambar</span>
            <span class="text-[10px] font-medium text-slate-300">JPG / PNG, maks 2MB</span>
          </button>
        </div>

        <div class="relative">
          <input v-model="form.name" type="text" id="menuName" class="peer w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-5 pt-6 pb-2 text-sm font-bold focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder-transparent" placeholder="Nama">
          <label for="menuName" class="absolute left-5 top-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider peer-focus:text-orange-500 transition-colors">Nama Menu *</label>
        </div>
        
        <div class="relative">
          <input v-model="form.price" type="number" id="menuPrice" class="peer w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-5 pt-6 pb-2 text-sm font-bold focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder-transparent" placeholder="Harga">
          <label for="menuPrice" class="absolute left-5 top-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider peer-focus:text-orange-500 transition-colors">Harga Satuan (Rp) *</label>
        </div>
        
        <div class="relative">
          <textarea v-model="form.desc" id="menuDesc" rows="3" class="peer w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-5 pt-6 pb-2 text-sm font-bold focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder-transparent resize-none" placeholder="Deskripsi"></textarea>
          <label for="menuDesc" class="absolute left-5 top-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider peer-focus:text-orange-500 transition-colors">Bahan / Deskripsi</label>
        </div>
        
        <div class="pt-4 flex gap-3">
          <button v-if="isEditing" @click="resetForm" class="w-1/3 bg-slate-100 text-slate-500 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
          <button @click="saveItem" :class="['flex-1 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95', isEditing ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30']">
            {{ isEditing ? 'Simpan Perubahan' : 'Tambah Ke Katalog' }}
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>