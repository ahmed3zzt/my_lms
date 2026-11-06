<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="w-full max-w-md rounded-2xl border border-dark-border bg-dark-card p-8 shadow-2xl">
      <div class="text-center mb-8">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3 font-mono font-bold text-lg">
          AE
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
        <p class="text-xs text-zinc-400 mt-1">Authorized access only. Single administrator portal.</p>
      </div>

      <div v-if="errorMsg" class="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-zinc-300 mb-1">Administrator Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="admin@ahmedezz.dev"
            class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-zinc-300 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••••••"
            class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full rounded-xl bg-emerald-500 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-950 hover:bg-emerald-400 transition-colors disabled:opacity-50"
        >
          {{ isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard' }}
        </button>
      </form>

      <div class="mt-6 pt-6 border-t border-dark-border text-center text-xs text-zinc-500 font-mono">
        Default mock credentials during preview:<br>
        <span class="text-zinc-400">admin@ahmedezz.dev / password</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('admin@ahmedezz.dev')
const password = ref('')
const isSubmitting = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  isSubmitting.value = true
  errorMsg.value = ''
  try {
    await authStore.login(email.value, password.value)
    router.push('/admin')
  } catch (err: any) {
    errorMsg.value = err.message || 'Failed to authenticate. Please check your credentials.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
