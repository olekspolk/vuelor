<script lang="ts">
export interface GradientPickerPositionInputProps {
  /** Stop to edit; defaults to the selected stop. */
  stopId?: number,
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
import { clampPosition } from '../core/stops.ts'
import { injectGradientPickerContext } from './GradientPickerRoot.vue'

const props = defineProps<GradientPickerPositionInputProps>()

const rootContext = injectGradientPickerContext()

const stop = computed(() =>
  (props.stopId !== undefined
    ? rootContext.stops.value.find((s) => s.id === props.stopId)
    : undefined) ?? rootContext.selectedStop.value
)

function commit (event: Event) {
  const target = event.target as HTMLInputElement
  const match = target.value.trim().match(/^(-?\d+(?:\.\d+)?)\s*%?$/)
  if (match) {
    const value = clampPosition(parseFloat(match[1]!))
    // Written back by hand: when the clamped value equals the current one the
    // binding has nothing to patch, yet the field may show the raw text.
    target.value = `${value}%`
    rootContext.moveStop(stop.value.id, value)
    rootContext.commitValue()
  } else {
    target.value = `${stop.value.position}%`
  }
}

const ui = rootContext.uiSlots('input')
</script>

<template>
  <div
    :data-disabled="rootContext.disabled.value ? '' : undefined"
    :class="ui.group('w-12', props.ui?.group, props.class)"
  >
    <div :class="ui.item(props.ui?.item)">
      <input
        type="text"
        inputmode="numeric"
        :aria-label="props.label ?? 'Stop position'"
        :disabled="rootContext.disabled.value"
        :value="`${stop.position}%`"
        :class="ui.field(props.ui?.field)"
        @blur="commit"
        @keydown.enter.prevent="commit"
      >
    </div>
  </div>
</template>
