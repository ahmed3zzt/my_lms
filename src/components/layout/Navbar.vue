<template>
  <header class="sticky top-0 z-40 w-full border-b border-dark-border bg-[#090a0f]/80 backdrop-blur-md transition-colors">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Brand -->
      <div class="flex items-center gap-6">
        <RouterLink to="/" class="group flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 font-mono text-sm font-bold text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            AE
          </div>
          <div>
            <span class="block text-sm font-semibold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              Ahmed Ezz
            </span>
            <span class="block text-xs text-zinc-400 font-mono">
              Backend Systems
            </span>
          </div>
        </RouterLink>

        <!-- Nav Links (Desktop) -->
        <nav class="hidden md:flex items-center gap-1 pl-4">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
            :class="$route.path.startsWith(item.path) && item.path !== '/' || $route.path === item.path
              ? 'bg-zinc-800/60 text-emerald-400'
              : 'text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-200'"
          >
            {{ item.name }}
          </RouterLink>
        </nav>
      </div>

      <!-- Right Controls -->
      <div class="flex items-center gap-3">
        <!-- Search Trigger -->
        <button
          type="button"
          @click="$emit('openSearch')"
          class="flex items-center gap-2 rounded-xl border border-dark-border bg-dark-card px-3 py-1.5 text-xs text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-colors"
        >
          <svg class="h-3.5 w-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span class="hidden sm:inline">Search lessons...</span>
          <kbd class="hidden sm:inline rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">⌘K</kbd>
        </button>

        <!-- Admin Dashboard Quick Link (if logged in) -->
        <RouterLink
          v-if="authStore.user"
          to="/admin"
          class="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Admin</span>
        </RouterLink>

        <!-- GitHub External -->
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-xl border border-dark-border bg-dark-card p-2 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
          title="GitHub"
        >
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </a>

        <!-- Mobile Menu Toggle -->
        <button
          type="button"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden rounded-xl border border-dark-border bg-dark-card p-2 text-zinc-400 hover:text-white"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown -->
    <div v-if="isMobileMenuOpen" class="md:hidden border-b border-dark-border bg-[#0d1117] px-4 py-3 space-y-1">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        @click="isMobileMenuOpen = false"
        class="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
      >
        {{ item.name }}
      </RouterLink>
      <RouterLink
        v-if="authStore.user"
        to="/admin"
        @click="isMobileMenuOpen = false"
        class="block rounded-lg px-3 py-2 text-sm font-medium text-emerald-400 hover:bg-zinc-800"
      >
        Admin Dashboard
      </RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

defineEmits<{
  (e: 'openSearch'): void
}>()

const authStore = useAuthStore()
const isMobileMenuOpen = ref(false)

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Courses', path: '/courses' },
  { name: 'Categories', path: '/categories' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' }
]
</script>
