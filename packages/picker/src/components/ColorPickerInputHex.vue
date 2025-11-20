<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import type { UiInputSlots } from '../utils/styles'
import { clamp } from '../utils/helpers.ts'
import { RGBAtoHexa } from '../utils/color.ts'
import { parseHex, getHexColorFromHexString, getAlphaFromHexString } from '../utils/parsers.ts'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const props = defineProps<{
  modelValue?: string,
  class?: string,
  ui?: Partial<UiInputSlots>
}>()

const rootContext = injectColorPickerContext()

const instance = getCurrentInstance()

const hasVModel = computed(() => {
  return !!instance?.vnode.props?.['onUpdate:modelValue']
})

const hexValue = computed(() => {
  return hasVModel.value
    ? getHexColorFromHexString(props.modelValue as string)
    : rootContext.hex.value.replace('#', '')
})

const alphaValue = computed(() => {
  return hasVModel.value
    ? getAlphaFromHexString(props.modelValue as string)
    : rootContext.alpha.value
})

function handleHexInput(e: Event) {
  const target = e.target as HTMLInputElement
  const rgba = target.value ? parseHex(target.value) : null
  if (!rgba) {
    target.value = hexValue.value as string
    return
  }
  if (hasVModel.value) {
    emit('update:modelValue', RGBAtoHexa(rgba))
  } else {
    rootContext.rgba.value = rgba
    rootContext.emitUpdateEnd()
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
  <div
    :class="ui.group(props.ui?.group, props.class)"
    :data-disabled="rootContext.disabled.value ? '' : null"
  >
    <div :class="ui.item(props.ui?.item)">
      <slot name="before" />
      <span :class="ui.label(props.ui?.label)">#</span>
      <input
        type="text"
        name="hex"
        aria-label="Hex"
        :value="hexValue"
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
        :value="alphaValue"
        :disabled="rootContext.disabled.value"
        :class="ui.field(props.ui?.field)"
        @blur="handleAlphaInput"
      />
      <span data-alpha-label :class="ui.label(props.ui?.label)">%</span>
    </div>
  </div>
</template>
