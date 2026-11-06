<template>
  <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
    <!-- Header with Profile Photo -->
    <div class="flex flex-col sm:flex-row items-center sm:items-start gap-8 border-b border-dark-border pb-10">
      <img
        :src="siteData.profile.avatarUrl"
        :alt="siteData.profile.name"
        class="h-32 w-32 sm:h-40 sm:w-40 rounded-3xl object-cover border-2 border-emerald-500/30 shadow-xl shadow-emerald-500/5 shrink-0"
      />
      <div class="text-center sm:text-left space-y-3">
        <div class="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-mono text-emerald-400">
          {{ siteData.profile.badge }}
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {{ siteData.profile.name }}
        </h1>
        <p class="text-lg font-medium text-emerald-400 font-mono">
          {{ siteData.profile.title }}
        </p>
        <p class="text-zinc-400 text-sm leading-relaxed max-w-xl">
          {{ siteData.profile.bio }}
        </p>

        <!-- Social & Direct Channels -->
        <div class="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
          <a
            :href="siteData.profile.links.github"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 rounded-xl border border-dark-border bg-dark-card px-3 py-2 text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
          >
            <span>GitHub</span>
          </a>
          <a
            :href="siteData.profile.links.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 rounded-xl border border-dark-border bg-dark-card px-3 py-2 text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
          >
            <span>LinkedIn</span>
          </a>
          <a
            :href="siteData.profile.links.youtube"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 rounded-xl border border-dark-border bg-dark-card px-3 py-2 text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
          >
            <span>YouTube</span>
          </a>
          <a
            :href="siteData.profile.links.portfolio"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 rounded-xl border border-dark-border bg-dark-card px-3 py-2 text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
          >
            <span>Portfolio</span>
          </a>
          <a
            :href="`mailto:${siteData.profile.email}`"
            class="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            <span>Email</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Core Engineering Competencies & Skills -->
    <section class="space-y-6">
      <h2 class="text-xl font-bold text-white tracking-tight">Technical Skills & Expertise</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="skillGroup in siteData.skills"
          :key="skillGroup.category"
          class="rounded-2xl border border-dark-border bg-dark-card p-5"
        >
          <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-3">
            {{ skillGroup.category }}
          </h3>
          <ul class="space-y-1.5 text-xs text-zinc-300">
            <li v-for="item in skillGroup.items" :key="item" class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Experience Timeline -->
    <section class="space-y-6">
      <h2 class="text-xl font-bold text-white tracking-tight">Experience & Focus</h2>
      <div class="space-y-4">
        <div
          v-for="exp in siteData.experience"
          :key="exp.role"
          class="rounded-2xl border border-dark-border bg-dark-card p-6"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <h3 class="font-bold text-base text-zinc-100">{{ exp.role }}</h3>
            <span class="text-xs font-mono text-zinc-500">{{ exp.period }}</span>
          </div>
          <p class="text-xs text-emerald-400 font-mono mb-3">{{ exp.company }}</p>
          <p class="text-sm text-zinc-400 leading-relaxed">{{ exp.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import siteData from '@/data'
</script>
