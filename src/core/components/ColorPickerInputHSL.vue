<script setup lang="ts">
import type { UiInputSlots } from '../utils/styles'
import { clamp } from '../utils/helpers.ts'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const props = defineProps<{
  class?: string,
  ui?: Partial<UiInputSlots>
}>()

const rootContext = injectColorPickerContext()

function parseChannelValue(e: Event, channel: 'h' | 's' | 'l', max: number) {
  const target = e.target as HTMLInputElement
  const intValue = parseInt(target.value, 10)
  const value = isNaN(intValue)
    ? rootContext.hsl.value[channel]
    : clamp(intValue, 0, max)
  if (rootContext.hsl.value[channel] !== value) {
    rootContext.hsl.value = {
      ...rootContext.hsl.value,
      [channel]: channel === 'h' ? value : value / 100
    }
    rootContext.emitUpdateEnd()
  }
}

const round = (value: number) => Math.round(value * 100)

const ui = rootContext.uiSlots('input')
</script>

<template>
  <div :class="ui.group(props.ui?.group, props.class)">
    <input
      type="text"
      name="hue"
      aria-label="Hue"
      :disabled="rootContext.disabled.value"
      :class="ui.field('px-1', props.ui?.field)"
      :value="Math.round(rootContext.hsl.value.h)"
      @blur="parseChannelValue($event, 'h', 359)"
    />
    <input
      type="text"
      name="saturation"
      aria-label="Saturation"
      :disabled="rootContext.disabled.value"
      :class="ui.field('px-1', props.ui?.field)"
      :value="round(rootContext.hsl.value.s)"
      @blur="parseChannelValue($event, 's', 100)"
    />
    <input
      type="text"
      name="lightness"
      aria-label="Lightness"
      :disabled="rootContext.disabled.value"
      :class="ui.field('px-1', props.ui?.field)"
      :value="round(rootContext.hsl.value.l)"
      @blur="parseChannelValue($event, 'l', 100)"
    />
    <input
      v-if="rootContext.isAlphaEnabled.value"
      type="text"
      name="opacity"
      aria-label="Opacity"
      :disabled="rootContext.disabled.value"
      :class="ui.field('flex-0 w-12', props.ui?.field)"
      :value="rootContext.alpha.value"
    />
  </div>
</template>
