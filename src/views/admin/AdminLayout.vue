<template>
  <div class="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col">
    <!-- Top Bar -->
    <header class="border-b border-dark-border bg-[#0d1117] px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30">
      <div class="flex items-center gap-4">
        <RouterLink to="/" class="text-xs font-mono text-zinc-400 hover:text-emerald-400 flex items-center gap-1.5">
          <span>← Back to Public Website</span>
        </RouterLink>
        <span class="text-zinc-600">|</span>
        <span class="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          Administrator Control Panel
        </span>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-xs text-zinc-400 font-mono hidden sm:inline">
          {{ authStore.user?.email }}
        </span>
        <button
          type="button"
          @click="handleLogout"
          class="rounded-lg border border-dark-border bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>

    <!-- Content Area with Admin Subnav -->
    <div class="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
      <!-- Admin Tab Navigation -->
      <nav class="flex flex-wrap items-center gap-2 border-b border-dark-border pb-4 mb-8 text-xs font-mono">
        <RouterLink
          to="/admin"
          class="rounded-xl px-4 py-2 transition-colors"
          :class="$route.path === '/admin' ? 'bg-emerald-500 text-zinc-950 font-bold' : 'bg-dark-card text-zinc-400 hover:text-white border border-dark-border'"
        >
          Overview
        </RouterLink>
        <RouterLink
          to="/admin/courses"
          class="rounded-xl px-4 py-2 transition-colors"
          :class="$route.path.startsWith('/admin/courses') ? 'bg-emerald-500 text-zinc-950 font-bold' : 'bg-dark-card text-zinc-400 hover:text-white border border-dark-border'"
        >
          Manage Courses
        </RouterLink>
        <RouterLink
          to="/admin/lessons"
          class="rounded-xl px-4 py-2 transition-colors"
          :class="$route.path.startsWith('/admin/lessons') ? 'bg-emerald-500 text-zinc-950 font-bold' : 'bg-dark-card text-zinc-400 hover:text-white border border-dark-border'"
        >
          Manage Lessons
        </RouterLink>
        <RouterLink
          to="/admin/categories"
          class="rounded-xl px-4 py-2 transition-colors"
          :class="$route.path.startsWith('/admin/categories') ? 'bg-emerald-500 text-zinc-950 font-bold' : 'bg-dark-card text-zinc-400 hover:text-white border border-dark-border'"
        >
          Categories & Tags
        </RouterLink>
      </nav>

      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  router.push('/admin/login')
}
</script>
