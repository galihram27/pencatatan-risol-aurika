<script setup>
import { ref } from 'vue'
import { store } from '../store.js'

const username = ref('')
const password = ref('')
const showPassword = ref(false)

async function handleSubmit() {
  if (!username.value.trim() || !password.value) {
    store.authError = 'Username dan password wajib diisi.'
    return
  }
  await store.login(username.value.trim(), password.value)
  // Jika berhasil, App.vue otomatis menampilkan aplikasi (store.isAuthenticated berubah).
}
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-slate-50 to-orange-100 p-6 font-sans text-slate-800 selection:bg-orange-200">
    <div class="w-full max-w-md">
      <!-- Kartu Login -->
      <div class="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
        <!-- Header brand -->
        <div class="px-8 pt-10 pb-8 text-center">
          <div class="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 shadow-inner mx-auto mb-5">
            <i class="fa-solid fa-book-open text-2xl"></i>
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Aurika
          </h1>
          <p class="text-sm text-slate-400 font-medium mt-1">Masuk untuk mengelola pesanan risol</p>
        </div>

        <!-- Form -->
        <form class="px-8 pb-10 space-y-5" @submit.prevent="handleSubmit">
          <!-- Pesan error -->
          <div v-if="store.authError"
               class="flex items-center gap-2.5 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>{{ store.authError }}</span>
          </div>

          <!-- Username -->
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Username</label>
            <div class="relative">
              <i class="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
              <input v-model="username" type="text" autocomplete="username" placeholder="Masukkan username"
                     class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition" />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Password</label>
            <div class="relative">
              <i class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
              <input v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Masukkan password"
                     class="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition" />
              <button type="button" @click="showPassword = !showPassword"
                      class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-orange-500 transition-colors">
                <i :class="['fa-solid', showPassword ? 'fa-eye-slash' : 'fa-eye']"></i>
              </button>
            </div>
          </div>

          <!-- Tombol submit -->
          <button type="submit" :disabled="store.authLoading"
                  class="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-[0_8px_20px_rgba(249,115,22,0.3)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
            <i v-if="store.authLoading" class="fa-solid fa-circle-notch fa-spin"></i>
            <i v-else class="fa-solid fa-arrow-right-to-bracket"></i>
            {{ store.authLoading ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>
      </div>

      <p class="text-center text-xs text-slate-400 font-medium mt-6">
        &copy; {{ new Date().getFullYear() }} Aurika &middot; Pencatatan Pesanan Risol
      </p>
    </div>
  </div>
</template>
