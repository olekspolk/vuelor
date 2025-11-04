<script setup lang="ts">
import type { UiInputSlots } from '../utils/styles'
import { clamp } from '../utils/helpers.ts'
import { parseHex } from '../utils/parsers.ts'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const props = defineProps<{
  class?: string,
  ui?: Partial<UiInputSlots>
}>()

const rootContext = injectColorPickerContext()

function handleHexInput(e: Event) {
  const target = e.target as HTMLInputElement
  const rgbaValue = parseHex(target.value)
  if (rgbaValue) {
    rootContext.rgba.value = rgbaValue
    rootContext.emitUpdateEnd()
  } else {
    target.value = rootContext.hex.value
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

const ui = rootContext.uiSlots('input')
</script>

<template>
  <div :class="ui.group(props.ui?.group, props.class)">
    <div :class="ui.item(props.ui?.item)">
      <span :class="ui.label(props.ui?.label)">#</span>
      <input
        type="text"
        name="hex"
        aria-label="Hex"
        :value="rootContext.hex.value.replace('#', '')"
        :disabled="rootContext.disabled.value"
        :class="ui.field(props.ui?.field)"
        @blur="handleHexInput"
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
