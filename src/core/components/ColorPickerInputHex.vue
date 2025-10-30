<script setup lang="ts">
import type { UiInputSlots } from '../utils/styles'
import { clamp } from '../utils/helpers.ts'
import { parseHexColor } from '../utils/parsers.ts'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const props = defineProps<{
  class?: string,
  ui?: Partial<UiInputSlots>
}>()

const rootContext = injectColorPickerContext()

function handleHexInput(e: Event) {
  const target = e.target as HTMLInputElement
  const rgbaValue = parseHexColor(target.value)
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
    ? Math.round(rootContext.rgba.value.a * 100)
    : clamp(intValue, 0, 100)
  const alpha = value / 100
  if (Math.round(rootContext.rgba.value.a * 100) !== value) {
    rootContext.rgba.value = {
      ...rootContext.rgba.value,
      a: alpha
    }
    rootContext.emitUpdateEnd()
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
      />
      <span :class="ui.label(props.ui?.label)">%</span>
    </div>
  </div>
</template>
