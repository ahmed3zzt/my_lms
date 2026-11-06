<template>
  <div class="min-h-screen bg-[#090a0f] text-[#f0f6fc] flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
    <!-- Public Navbar (shown on all public routes) -->
    <Navbar
      v-if="!isAdminRoute"
      @openSearch="isSearchOpen = true"
    />

    <!-- Main Page Content -->
    <div class="flex-1">
      <RouterView />
    </div>

    <!-- Public Footer (shown on all public routes) -->
    <Footer v-if="!isAdminRoute" />

    <!-- Global Search Modal -->
    <SearchModal
      :isOpen="isSearchOpen"
      @close="isSearchOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import SearchModal from '@/components/layout/SearchModal.vue'

const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const isSearchOpen = ref(false)

const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})

function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    isSearchOpen.value = !isSearchOpen.value
  }
}

onMounted(() => {
  themeStore.init()
  authStore.init()
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>
