<template>
  <footer class="border-t border-dark-border bg-[#090a0f] py-12 text-sm text-zinc-400">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
            AE
          </div>
          <div>
            <p class="font-medium text-zinc-200">Ahmed Ezz</p>
            <p class="text-xs text-zinc-500">Backend Software Engineer & Educator</p>
          </div>
        </div>

        <!-- Links -->
        <div class="flex flex-wrap items-center justify-center gap-6 text-xs">
          <RouterLink to="/courses" class="hover:text-zinc-200 transition-colors">Courses</RouterLink>
          <RouterLink to="/categories" class="hover:text-zinc-200 transition-colors">Categories</RouterLink>
          <RouterLink to="/about" class="hover:text-zinc-200 transition-colors">About</RouterLink>
          <RouterLink to="/contact" class="hover:text-zinc-200 transition-colors">Contact</RouterLink>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="hover:text-zinc-200 transition-colors">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="hover:text-zinc-200 transition-colors">LinkedIn</a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="hover:text-zinc-200 transition-colors">YouTube</a>
          <RouterLink to="/admin/login" class="text-zinc-600 hover:text-zinc-400 transition-colors">Admin</RouterLink>
        </div>
      </div>

      <div class="mt-8 pt-8 border-t border-dark-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>© {{ new Date().getFullYear() }} Ahmed Ezz. Designed for engineering depth & clean architecture.</p>
        <p class="flex items-center gap-1.5">
          <span>Zero-Cost Serverless Ready</span>
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>
