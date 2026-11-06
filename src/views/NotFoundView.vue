<template>
  <div class="mx-auto max-w-md px-4 py-24 text-center">
    <p class="text-sm font-mono font-bold text-emerald-400">404 ERROR</p>
    <h1 class="text-3xl font-extrabold text-white tracking-tight mt-2">Page Not Found</h1>
    <p class="text-sm text-zinc-400 mt-3 leading-relaxed">
      The requested route does not exist. Check the URL or return to the platform homepage.
    </p>
    <div class="mt-6">
      <RouterLink
        to="/"
        class="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-950 hover:bg-emerald-400 transition-colors"
      >
        Return to Home
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
