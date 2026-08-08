<script lang="ts">
export interface GradientPickerAngleInputProps {
  label?: string,
  class?: string,
  ui?: Partial<{
    group: string
    item: string
    field: string
  }>
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { normalizeAngle } from '../core/parse.ts'
import { injectGradientPickerContext } from './GradientPickerRoot.vue'

const props = defineProps<GradientPickerAngleInputProps>()

const rootContext = injectGradientPickerContext()

// The radial serializer has no angle, so the input disables itself there.
const isDisabled = computed(() =>
  rootContext.disabled.value || rootContext.type.value === 'radial'
)

function commit (event: Event) {
  const target = event.target as HTMLInputElement
  const match = target.value.trim().match(/^(-?\d+(?:\.\d+)?)\s*(?:°|deg)?$/i)
  if (match) {
    const value = normalizeAngle(match[1]!)
    target.value = `${value}°`
    // Only a genuine change writes and commits; re-parsing canonical text
    // (blur after Enter, or an untouched field) is a no-op.
    if (value !== rootContext.angle.value) {
      rootContext.angle.value = value
      rootContext.commitValue()
    }
  } else {
    target.value = `${rootContext.angle.value}°`
  }
}

const ui = rootContext.uiSlots('input')
</script>

<template>
  <div
    :data-disabled="isDisabled ? '' : undefined"
    :class="ui.group(props.ui?.group, props.class)"
  >
    <div :class="ui.item(props.ui?.item)">
      <input
        type="text"
        inputmode="numeric"
        :aria-label="props.label ?? 'Gradient angle'"
        :disabled="isDisabled"
        :value="`${rootContext.angle.value}°`"
        :class="ui.field(props.ui?.field)"
        @blur="commit"
        @keydown.enter.prevent="commit"
      >
    </div>
  </div>
</template>
