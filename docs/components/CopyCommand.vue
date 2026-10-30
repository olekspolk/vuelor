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
    class="vuelor-cmd group flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors hover:bg-white/[0.04]"
  >
    <span aria-hidden="true" class="select-none font-mono text-xs text-ember">$</span>
    <code class="min-w-0 flex-1 truncate font-mono text-xs text-bone/90">{{ command }}</code>
    <span
      aria-live="polite"
      class="flex shrink-0 items-center gap-1.5 font-display text-[0.65rem] font-bold tracking-[0.2em] uppercase transition-colors"
      :class="copied ? 'text-ember' : 'text-ash group-hover:text-bone'"
    >
      <svg v-if="copied" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {{ copied ? 'Copied' : 'Copy' }}
    </span>
  </button>
</template>
