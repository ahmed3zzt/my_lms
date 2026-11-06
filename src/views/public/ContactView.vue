<template>
  <div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
    <div>
      <span class="text-xs font-mono uppercase tracking-wider text-emerald-400">{{ siteData.site.contact.badge }}</span>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
        {{ siteData.site.contact.title }}
      </h1>
      <p class="mt-2 text-sm sm:text-base text-zinc-400 leading-relaxed">
        {{ siteData.site.contact.description }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <a
        :href="`mailto:${siteData.profile.email}`"
        class="rounded-2xl border border-dark-border bg-dark-card p-5 hover:border-emerald-500/40 transition-colors block"
      >
        <p class="text-xs font-mono text-zinc-500 uppercase">Email</p>
        <p class="text-sm font-medium text-emerald-400 mt-1 truncate">{{ siteData.profile.email }}</p>
      </a>
      <a
        :href="siteData.profile.links.youtube"
        target="_blank"
        rel="noopener noreferrer"
        class="rounded-2xl border border-dark-border bg-dark-card p-5 hover:border-zinc-700 transition-colors block"
      >
        <p class="text-xs font-mono text-zinc-500 uppercase">YouTube</p>
        <p class="text-sm font-medium text-zinc-200 mt-1 truncate">{{ siteData.site.contact.youtubeHandle }}</p>
      </a>
      <a
        :href="siteData.profile.links.github"
        target="_blank"
        rel="noopener noreferrer"
        class="rounded-2xl border border-dark-border bg-dark-card p-5 hover:border-zinc-700 transition-colors block"
      >
        <p class="text-xs font-mono text-zinc-500 uppercase">GitHub</p>
        <p class="text-sm font-medium text-zinc-200 mt-1 truncate">{{ siteData.profile.links.github.replace('https://', '') }}</p>
      </a>
    </div>

    <!-- Contact Form -->
    <div class="rounded-2xl border border-dark-border bg-dark-card p-6 sm:p-8">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="submitted" class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          Thank you! Your message has been received. {{ siteData.profile.name }} will get back to you shortly.
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-zinc-300 mb-1">Your Name</label>
            <input
              v-model="name"
              type="text"
              required
              placeholder="e.g. Linus Torvalds"
              class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-zinc-300 mb-1">Your Email</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="e.g. linus@kernel.org"
              class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-zinc-300 mb-1">Subject</label>
          <input
            v-model="subject"
            type="text"
            required
            placeholder="e.g. Question on Raft consensus RPC timeouts"
            class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-zinc-300 mb-1">Message</label>
          <textarea
            v-model="message"
            rows="5"
            required
            placeholder="Write your note, question, or feedback..."
            class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="rounded-xl bg-emerald-500 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-950 hover:bg-emerald-400 transition-colors disabled:opacity-50"
        >
          {{ isSubmitting ? 'Sending...' : 'Send Message' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import siteData from '@/data'

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')
const isSubmitting = ref(false)
const submitted = ref(false)

async function handleSubmit() {
  isSubmitting.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  isSubmitting.value = false
  submitted.value = true
  name.value = ''
  email.value = ''
  subject.value = ''
  message.value = ''
}
</script>
