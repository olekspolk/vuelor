<script setup>
import { ref, computed } from 'vue'
import { NAMESPACE, itemNameForFile } from '../registry.config.mjs'
import CopyCommand from './CopyCommand.vue'

const props = defineProps({
  path: String
})

const copied = ref(false)
const codeContainer = ref(null)

// The matching `shadcn-vue add @vuelor/<item>` command for this demo, derived from its source file.
const installCommand = computed(() => {
  const item = itemNameForFile(props.path)
  return item ? `npx shadcn-vue@latest add ${NAMESPACE}/${item}` : null
})

const copyToClipboard = async () => {
  if (!codeContainer.value) return
  try {
    await navigator.clipboard.writeText(codeContainer.value.textContent)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="my-5 overflow-hidden rounded-2xl border border-line bg-ink-raised/40">

    <div v-if="installCommand" class="border-b border-line">
      <CopyCommand :command="installCommand" />
    </div>

    <div data-vuelor-docs class="vuelor-demo-stage flex items-center justify-center border-b border-line p-10">
      <slot name="demo"></slot>
    </div>

    <div class="relative bg-[var(--vp-code-block-bg)] text-sm">
      <div class="flex items-center justify-between border-b border-line bg-ink-raised/70 px-4 py-2">
        <span class="font-mono text-xs text-ash">{{ props.path }}</span>
        <button
          @click="copyToClipboard"
          class="flex items-center justify-center rounded p-1 font-display text-[0.65rem] font-bold tracking-[0.2em] uppercase transition-colors"
          :class="copied ? 'text-ember' : 'text-ash hover:text-bone'"
        >
          <span v-if="!copied">Copy</span>
          <span v-else>Copied</span>
        </button>
      </div>

      <div ref="codeContainer" class="code-content overflow-x-auto">
        <slot name="code"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fix formatting for the injected code block */
.code-content :deep(pre) { margin: 0 !important; padding: 1rem !important; }
.code-content :deep(div[class*='language-']) { margin: 0 !important; border-radius: 0 !important; }
</style>
