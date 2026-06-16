<script setup>
import { ref } from 'vue'

const props = defineProps({
  command: String
})

const copied = ref(false)

const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.command)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <button
    type="button"
    :title="command"
    :aria-label="`Copy command: ${command}`"
    @click="copy"
    class="group flex w-full items-center gap-2.5 bg-[var(--vp-c-bg-soft)] px-3.5 py-2.5 text-left transition-colors hover:bg-[var(--vp-c-bg-mute)]"
  >
    <span aria-hidden="true" class="select-none font-mono text-xs text-[var(--vp-c-brand-1)]">$</span>
    <code class="min-w-0 flex-1 truncate font-mono text-xs text-[var(--vp-c-text-2)]">{{ command }}</code>
    <span
      class="flex shrink-0 items-center gap-1.5 text-xs font-medium transition-colors"
      :class="copied ? 'text-emerald-500' : 'text-[var(--vp-c-text-3)] group-hover:text-[var(--vp-c-text-1)]'"
    >
      <svg v-if="copied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      {{ copied ? 'Copied' : 'Copy' }}
    </span>
  </button>
</template>
