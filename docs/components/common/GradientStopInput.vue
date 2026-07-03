<script lang="ts" setup>
import { injectColorPickerContext } from '@vuelor/picker'

const props = defineProps<{
  modelValue: number
  label?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

function commit (e: Event) {
  const target = e.target as HTMLInputElement
  const match = target.value.trim().match(/^(-?\d+(?:\.\d+)?)\s*%?$/)
  if (match) {
    const value = Math.min(100, Math.max(0, Math.round(Number.parseFloat(match[1]!))))
    target.value = `${value}%`
    emit('update:modelValue', value)
  } else {
    target.value = `${props.modelValue}%`
  }
}

const rootContext = injectColorPickerContext()

const ui = rootContext.uiSlots('input')
</script>

<template>
  <div :class="ui.group('w-12')">
    <div :class="ui.item()">
      <input
        type="text"
        inputmode="numeric"
        :aria-label="props.label ?? 'Stop position'"
        :disabled="rootContext.disabled.value"
        :value="`${props.modelValue}%`"
        :class="ui.field()"
        @blur="commit"
        @keydown.enter.prevent="commit"
      >
    </div>
  </div>
</template>
