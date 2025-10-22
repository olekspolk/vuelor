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

const ui = tv(input)({
  disabled: rootContext.disabled.value
})
</script>

<template>
  <div :class="ui.group({ class: [props.ui?.group, props.class] })">
    <input
      type="text"
      aria-label="Red"
      :disabled="rootContext.disabled.value"
      :class="ui.field({ class: ['px-1', props.ui?.field] })"
      :value="round(rootContext.rgb.value.r)"
      @blur="parseChannelValue($event, 'r')"
    />
    <input
      type="text"
      aria-label="Green"
      :disabled="rootContext.disabled.value"
      :class="ui.field({ class: ['px-1', props.ui?.field] })"
      :value="round(rootContext.rgb.value.g)"
      @blur="parseChannelValue($event, 'g')"
    />
    <input
      type="text"
      aria-label="Blue"
      :disabled="rootContext.disabled.value"
      :class="ui.field({ class: ['px-1', props.ui?.field] })"
      :value="round(rootContext.rgb.value.b)"
      @blur="parseChannelValue($event, 'b')"
    />
    <input
      v-if="rootContext.isAlphaEnabled.value"
      type="text"
      aria-label="Opacity"
      :disabled="rootContext.disabled.value"
      :value="rootContext.alpha.value"
      :class="ui.field({ class: ['flex-0 w-12', props.ui?.field] })"
    />
  </div>
</template>
