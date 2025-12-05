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
    rootContext.commitValue()
  } else {
    target.value = channel !== 'h'
      ? Math.round(value * 100).toString()
      : value.toString()
  }
}

function handleAlphaInput(e: Event) {
  const target = e.target as HTMLInputElement
  const intValue = parseInt(target.value, 10)
  const value = isNaN(intValue)
    ? rootContext.alpha.value
    : clamp(intValue, 0, 100)
  if (rootContext.alpha.value !== value) {
    rootContext.alpha.value = value
    rootContext.commitValue()
  } else {
    target.value = value.toString()
  }
}

const round = (value: number) => Math.round(value * 100)

const ui = rootContext.uiSlots('input')
</script>

<template>
  <div
    :class="ui.group(props.ui?.group, props.class)"
    :data-disabled="rootContext.disabled.value ? '' : null"
  >
    <div :class="ui.item(props.ui?.item)">
      <slot name="before" />
      <span :class="ui.label(props.ui?.label)">H</span>
      <input
        type="text"
        name="hue"
        aria-label="Hue"
        :disabled="rootContext.disabled.value"
        :class="ui.field(props.ui?.field)"
        :value="Math.round(rootContext.hsl.value.h)"
        @blur="parseChannelValue($event, 'h', 360)"
      />
    </div>

    <div :class="ui.item(props.ui?.item)">
      <span :class="ui.label(props.ui?.label)">S</span>
      <input
        type="text"
        name="saturation"
        aria-label="Saturation"
        :disabled="rootContext.disabled.value"
        :class="ui.field(props.ui?.field)"
        :value="round(rootContext.hsl.value.s)"
        @blur="parseChannelValue($event, 's', 100)"
      />
    </div>

    <div :class="ui.item(props.ui?.item)">
      <span :class="ui.label(props.ui?.label)">L</span>
      <input
        type="text"
        name="lightness"
        aria-label="Lightness"
        :disabled="rootContext.disabled.value"
        :class="ui.field(props.ui?.field)"
        :value="round(rootContext.hsl.value.l)"
        @blur="parseChannelValue($event, 'l', 100)"
      />
    </div>

    <div
      v-if="rootContext.isAlphaEnabled.value"
      data-alpha-input
      :class="ui.item(props.ui?.item)"
    >
      <input
        type="text"
        name="opacity"
        aria-label="Opacity"
        :value="rootContext.alpha.value"
        :disabled="rootContext.disabled.value"
        :class="ui.field(props.ui?.field)"
        @blur="handleAlphaInput"
      />
      <span data-alpha-label :class="ui.label(props.ui?.label)">%</span>
    </div>
  </div>
</template>
