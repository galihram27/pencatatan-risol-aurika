<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Konfirmasi Hapus' },
  icon: { type: String, default: 'fa-trash-can' }
})

const visible = ref(false)
const message = ref('')
let resolver = null

const open = (msg) => {
  message.value = msg
  visible.value = true
  return new Promise((resolve) => { resolver = resolve })
}

const close = (result) => {
  visible.value = false
  if (resolver) { resolver(result); resolver = null }
}

defineExpose({ open })
</script>

<template>
  <Teleport to="body">
    <Transition name="confirm-fade">
      <div v-if="visible" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
           @click.self="close(false)">
        <div class="w-full max-w-sm bg-white rounded-[24px] shadow-2xl border border-slate-100 p-7 text-center">
          <div class="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-500 flex items-center justify-center text-2xl mb-5">
            <i :class="['fa-solid', props.icon]"></i>
          </div>
          <h3 class="text-lg font-extrabold text-slate-800 mb-1">{{ props.title }}</h3>
          <p class="text-sm text-slate-500 font-medium mb-6 leading-relaxed">{{ message }}</p>
          <div class="flex gap-3">
            <button @click="close(false)"
                    class="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button @click="close(true)"
                    class="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/30 transition-colors active:scale-95">
              OK
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.confirm-fade-enter-active,
.confirm-fade-leave-active { transition: opacity 0.2s ease; }
.confirm-fade-enter-from,
.confirm-fade-leave-to { opacity: 0; }
</style>
