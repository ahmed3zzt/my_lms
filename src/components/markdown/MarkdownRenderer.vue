<template>
  <div ref="containerRef" class="markdown-body prose prose-zinc dark:prose-invert max-w-none" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { Marked } from 'marked'
import hljs from 'highlight.js'
import mermaid from 'mermaid'
import { slugify, processCallouts } from '@/utils/markdown'

const props = defineProps<{
  content: string
}>()

const containerRef = ref<HTMLElement | null>(null)

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#0d1117',
    primaryColor: '#10b981',
    primaryTextColor: '#f0f6fc',
    primaryBorderColor: '#059669',
    lineColor: '#6e7681',
    secondaryColor: '#161b22',
    tertiaryColor: '#090d16'
  }
})

// Configure Marked
const marked = new Marked({
  gfm: true,
  breaks: true
})

// Custom renderer for code blocks and headings
marked.use({
  renderer: {
    heading({ tokens, depth }: { tokens: any[]; depth: number }) {
      const text = this.parser.parseInline(tokens)
      const plain = text.replace(/<[^>]+>/g, '')
      const id = slugify(plain)
      return `<h${depth} id="${id}" class="group relative scroll-mt-24 cursor-pointer font-bold">
        <a href="#${id}" class="absolute -left-5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400 no-underline font-normal">#</a>
        ${text}
      </h${depth}>`
    },
    code({ text, lang }: { text: string; lang?: string }) {
      const language = lang?.trim().toLowerCase()

      // Handle Mermaid diagrams
      if (language === 'mermaid') {
        return `<div class="mermaid-diagram my-6 p-4 rounded-xl border border-dark-border bg-[#0d1117] flex justify-center overflow-x-auto">
          <pre class="mermaid text-sm">${text}</pre>
        </div>`
      }

      // Syntax highlighting with highlight.js
      let highlighted = text
      let validLang = language || 'plaintext'
      if (language && hljs.getLanguage(language)) {
        try {
          highlighted = hljs.highlight(text, { language }).value
        } catch {
          highlighted = hljs.highlightAuto(text).value
        }
      } else {
        try {
          highlighted = hljs.highlightAuto(text).value
        } catch {
          // fallback plain text
        }
      }

      // Code block with top bar: language label + copy button
      return `<div class="code-block-wrapper my-6 rounded-xl border border-dark-border bg-[#0d1117] overflow-hidden shadow-lg">
        <div class="code-header flex items-center justify-between px-4 py-2 border-b border-dark-border bg-[#161b22]/70 text-xs font-mono text-zinc-400">
          <span class="font-medium text-emerald-400 uppercase">${validLang}</span>
          <button type="button" class="copy-code-btn inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-zinc-300 hover:text-white transition-colors cursor-pointer" data-code="${encodeURIComponent(text)}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            <span>Copy</span>
          </button>
        </div>
        <pre class="p-4 overflow-x-auto text-sm leading-relaxed font-mono text-zinc-200"><code>${highlighted}</code></pre>
      </div>`
    }
  }
})

// Callout replacement mapper
function formatCallouts(html: string): string {
  const calloutRegex = /:::callout\{type="([a-z]+)"\}\n([\s\S]*?)\n:::/g
  const calloutConfig: Record<string, { title: string; color: string; border: string; bg: string; icon: string }> = {
    note: {
      title: 'Note',
      color: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'bg-blue-950/20',
      icon: `<svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
    },
    tip: {
      title: 'Tip',
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/20',
      icon: `<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>`
    },
    important: {
      title: 'Important',
      color: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-950/20',
      icon: `<svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`
    },
    warning: {
      title: 'Warning',
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-950/20',
      icon: `<svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`
    },
    caution: {
      title: 'Caution',
      color: 'text-rose-400',
      border: 'border-rose-500/30',
      bg: 'bg-rose-950/20',
      icon: `<svg class="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>`
    }
  }

  return html.replace(calloutRegex, (_, type, body) => {
    const config = calloutConfig[type] || calloutConfig.note
    return `<div class="callout my-6 p-4 rounded-xl border ${config.border} ${config.bg} text-sm leading-relaxed">
      <div class="flex items-center gap-2 font-semibold ${config.color} mb-2">
        ${config.icon}
        <span>${config.title}</span>
      </div>
      <div class="text-zinc-300 dark:text-zinc-300 prose-sm">${body}</div>
    </div>`
  })
}

const renderedHtml = computed(() => {
  if (!props.content) return ''
  const preprocessed = processCallouts(props.content)
  const rawHtml = marked.parse(preprocessed) as string
  return formatCallouts(rawHtml)
})

function attachCopyListeners() {
  if (!containerRef.value) return
  const buttons = containerRef.value.querySelectorAll('.copy-code-btn')
  buttons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const target = e.currentTarget as HTMLButtonElement
      const code = decodeURIComponent(target.getAttribute('data-code') || '')
      if (code) {
        await navigator.clipboard.writeText(code)
        const span = target.querySelector('span')
        if (span) {
          span.textContent = 'Copied!'
          target.classList.add('text-emerald-400')
          setTimeout(() => {
            span.textContent = 'Copy'
            target.classList.remove('text-emerald-400')
          }, 2000)
        }
      }
    })
  })
}

async function renderMermaid() {
  await nextTick()
  if (!containerRef.value) return
  const mermaidNodes = containerRef.value.querySelectorAll('.mermaid')
  if (mermaidNodes.length > 0) {
    try {
      await mermaid.run({
        nodes: mermaidNodes as any
      })
    } catch (err) {
      console.warn('Mermaid rendering issue:', err)
    }
  }
}

onMounted(() => {
  attachCopyListeners()
  renderMermaid()
})

watch(() => props.content, async () => {
  await nextTick()
  attachCopyListeners()
  await renderMermaid()
})
</script>

<style>
/* Syntax highlighting styles inspired by GitHub Dark Dimmed */
.markdown-body pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 0;
  background: transparent;
}

.hljs-keyword,
.hljs-selector-tag,
.hljs-built_in {
  color: #ff7b72;
}

.hljs-string,
.hljs-title,
.hljs-section,
.hljs-attribute,
.hljs-literal,
.hljs-template-tag,
.hljs-template-variable,
.hljs-type {
  color: #a5d6ff;
}

.hljs-comment,
.hljs-quote,
.hljs-deletion,
.hljs-meta {
  color: #8b949e;
  font-style: italic;
}

.hljs-number,
.hljs-regexp,
.hljs-link {
  color: #79c0ff;
}

.hljs-function .hljs-title {
  color: #d2a8ff;
}

.hljs-variable {
  color: #ffa657;
}

/* Callout inner prose reset */
.callout p {
  margin: 0;
}
.callout p + p {
  margin-top: 0.5rem;
}
</style>
