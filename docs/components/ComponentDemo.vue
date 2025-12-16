<script setup>
import { ref } from 'vue'

const props = defineProps({
  path: String
})

const copied = ref(false)
const codeContainer = ref(null)

const copyToClipboard = async () => {
  if (!codeContainer.value) return
  const codeText = codeContainer.value.textContent
  try {
    await navigator.clipboard.writeText(codeText)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="my-4 overflow-hidden rounded-lg border border-[var(--vp-c-divider)] bg-[var(--vp-c-bg)]">

    <div data-vuelor-docs class="flex items-center justify-center border-b border-[var(--vp-c-divider)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] p-10">
      <slot name="demo"></slot>
    </div>

    <div class="relative bg-[var(--vp-c-bg-alt)] text-sm">
      <div class="flex items-center justify-between border-b border-[var(--vp-c-divider)] bg-[var(--vp-c-bg-soft)] px-4 py-2">
        <span class="text-xs font-semibold text-[var(--vp-c-text-2)]">{{ props.path }}</span>
        <button @click="copyToClipboard" class="flex items-center justify-center rounded p-1 text-[var(--vp-c-text-2)] hover:bg-[var(--vp-c-gray-dimm)]">
           <span v-if="!copied">Copy</span>
           <span v-else class="text-emerald-500">Copied!</span>
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
