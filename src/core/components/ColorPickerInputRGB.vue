<script setup lang="ts">
import type { UiInputSlots } from '../utils/styles'
import { clamp } from '../utils/helpers.ts'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const props = defineProps<{
  class?: string,
  ui?: Partial<UiInputSlots>
}>()

const rootContext = injectColorPickerContext()

function parseChannelValue(e: Event, channel: 'r' | 'g' | 'b') {
  const target = e.target as HTMLInputElement
  const intValue = parseInt(target.value, 10)
  const value = isNaN(intValue)
    ? rootContext.rgb.value[channel]
    : clamp(intValue, 0, 255)
  if (rootContext.rgb.value[channel] !== value) {
    rootContext.rgb.value = {
      ...rootContext.rgb.value,
      [channel]: value
    }
    rootContext.emitUpdateEnd()
  }
}

const round = (value: number) => Math.round(value)

const ui = rootContext.uiSlots('input')
</script>

<template>
  <div :class="ui.group(props.ui?.group, props.class)">
    <input
      type="text"
      name="red"
      aria-label="Red"
      :disabled="rootContext.disabled.value"
      :class="ui.field('px-1', props.ui?.field)"
      :value="round(rootContext.rgb.value.r)"
      @blur="parseChannelValue($event, 'r')"
    />
    <input
      type="text"
      name="green"
      aria-label="Green"
      :disabled="rootContext.disabled.value"
      :class="ui.field('px-1', props.ui?.field)"
      :value="round(rootContext.rgb.value.g)"
      @blur="parseChannelValue($event, 'g')"
    />
    <input
      type="text"
      name="blue"
      aria-label="Blue"
      :disabled="rootContext.disabled.value"
      :class="ui.field('px-1', props.ui?.field)"
      :value="round(rootContext.rgb.value.b)"
      @blur="parseChannelValue($event, 'b')"
    />
    <input
      v-if="rootContext.isAlphaEnabled.value"
      type="text"
      name="opacity"
      aria-label="Opacity"
      :disabled="rootContext.disabled.value"
      :value="rootContext.alpha.value"
      :class="ui.field('flex-0 w-12', props.ui?.field)"
    />
  </div>
</template>
