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
  } else {
    target.value = value.toString()
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
    rootContext.emitUpdateEnd()
  } else {
    target.value = value.toString()
  }
}

const round = (value: number) => Math.round(value)

const ui = rootContext.uiSlots('input')
</script>

<template>
  <div :class="ui.group(props.ui?.group, props.class)">
    <slot name="before" />
    <div :class="ui.item(props.ui?.item)">
      <span :class="ui.label(props.ui?.label)">R</span>
      <input
        type="text"
        name="red"
        aria-label="Red"
        :disabled="rootContext.disabled.value"
        :class="ui.field(props.ui?.field)"
        :value="round(rootContext.rgb.value.r)"
        @blur="parseChannelValue($event, 'r')"
      />
    </div>
    <div :class="ui.item(props.ui?.item)">
      <span :class="ui.label(props.ui?.label)">G</span>
      <input
        type="text"
        name="green"
        aria-label="Green"
        :disabled="rootContext.disabled.value"
        :class="ui.field(props.ui?.field)"
        :value="round(rootContext.rgb.value.g)"
        @blur="parseChannelValue($event, 'g')"
      />
    </div>
    <div :class="ui.item(props.ui?.item)">
      <span :class="ui.label(props.ui?.label)">B</span>
      <input
        type="text"
        name="blue"
        aria-label="Blue"
        :disabled="rootContext.disabled.value"
        :class="ui.field(props.ui?.field)"
        :value="round(rootContext.rgb.value.b)"
        @blur="parseChannelValue($event, 'b')"
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
      <span :class="ui.label(props.ui?.label)">%</span>
    </div>
  </div>
</template>
