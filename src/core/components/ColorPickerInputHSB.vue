<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { input } from '../theme/index.ts'
import { clamp } from '../utils/helpers.ts'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const props = defineProps<{
  class?: string,
  ui?: Partial<typeof input.slots>
}>()

const rootContext = injectColorPickerContext()

function parseChannelValue(e: Event, channel: 'h' | 's' | 'v', max: number) {
  const target = e.target as HTMLInputElement
  const intValue = parseInt(target.value, 10)
  const value = isNaN(intValue)
    ? rootContext.hsv.value[channel]
    : clamp(intValue, 0, max)
  if (rootContext.hsv.value[channel] !== value) {
    rootContext.hsv.value = {
      ...rootContext.hsv.value,
      [channel]: channel === 'h' ? value : value / 100
    }
    rootContext.emitUpdateEnd()
  }
}

const round = (value: number) => Math.round(value * 100)

const ui = tv(input)()
</script>

<template>
  <div :class="ui.group({ class: [props.ui?.group, props.class] })">
    <input
      type="text"
      aria-label="Hue"
      :class="ui.field({ class: ['px-1', props.ui?.field] })"
      :value="rootContext.hsv.value.h"
      @blur="parseChannelValue($event, 'h', 359)"
    />
    <input
      type="text"
      aria-label="Saturation"
      :class="ui.field({ class: ['px-1', props.ui?.field] })"
      :value="round(rootContext.hsv.value.s)"
      @blur="parseChannelValue($event, 's', 100)"
    />
    <input
      type="text"
      aria-label="Brightness"
      :class="ui.field({ class: ['px-1', props.ui?.field] })"
      :value="round(rootContext.hsv.value.v)"
      @blur="parseChannelValue($event, 'v', 100)"
    />
    <input
      type="text"
      aria-label="Opacity"
      :class="ui.field({ class: ['flex-0 w-12', props.ui?.field] })"
      :value="rootContext.alpha.value"
    />
  </div>
</template>
