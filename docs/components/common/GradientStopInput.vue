<script lang="ts" setup>
import { injectColorPickerContext } from '@vuelor/picker'

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const props = defineProps<{
  modelValue: number
}>()

function handleInput (e: Event) {
  const target = e.target as HTMLInputElement
  const value = parseInt(target.value)
  if (!isNaN(value)) {
    const clampedValue = Math.min(100, Math.max(0, value))
    target.value = `${clampedValue}%`
    emit('update:modelValue', clampedValue)
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
        :disabled="rootContext.disabled.value"
        :value="`${props.modelValue}%`"
        :class="ui.field()"
        @blur="handleInput"
      >
    </div>
  </div>
</template>
