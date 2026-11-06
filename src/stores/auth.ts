import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '@/services'
import type { AuthUser } from '@/services/contracts/IAuthService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isLoading = ref(true)

  async function init() {
    try {
      user.value = await authService.getCurrentUser()
    } catch (err) {
      console.error('Failed to get current user:', err)
      user.value = null
    } finally {
      isLoading.value = false
    }

    authService.onAuthStateChange((newUser) => {
      user.value = newUser
      isLoading.value = false
    })
  }

  async function login(email: string, pass: string) {
    isLoading.value = true
    try {
      user.value = await authService.signIn(email, pass)
      return user.value
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true
    try {
      await authService.signOut()
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated: () => Boolean(user.value),
    init,
    login,
    logout
  }
})
