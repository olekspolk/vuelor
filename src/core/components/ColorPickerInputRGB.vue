<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { input } from '../theme'
import { clamp } from '../utils/helpers.ts'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const props = defineProps<{
  class?: string,
  ui?: Partial<typeof input.slots>
}>()

const rootContext = injectColorPickerContext()

function parseChannelValue(e: Event, channel: 'r' | 'g' | 'b') {
  const target = e.target as HTMLInputElement
  const intValue = parseInt(target.value, 10)
  const value = isNaN(intValue)
    ? rootContext.rgba.value[channel]
    : clamp(intValue, 0, 255)
  rootContext.rgba.value = {
    ...rootContext.rgba.value,
    [channel]: value
  }
}

const ui = tv(input)()
</script>

<template>
  <div :class="ui.group({ class: [props.ui?.group, props.class] })">
    <input
      type="text"
      aria-label="Red"
      :class="ui.field({ class: ['px-1', props.ui?.field] })"
      :value="rootContext.rgba.value.r"
      @blur="parseChannelValue($event, 'r')"
    />
    <input
      type="text"
      aria-label="Green"
      :class="ui.field({ class: ['px-1', props.ui?.field] })"
      :value="rootContext.rgba.value.g"
      @blur="parseChannelValue($event, 'g')"
    />
    <input
      type="text"
      aria-label="Blue"
      :class="ui.field({ class: ['px-1', props.ui?.field] })"
      :value="rootContext.rgba.value.b"
      @blur="parseChannelValue($event, 'b')"
    />
    <input
      type="text"
      aria-label="Alpha"
      :value="rootContext.alpha.value"
      :class="ui.field({ class: ['flex-0 w-12', props.ui?.field] })"
    />
  </div>
</template>
