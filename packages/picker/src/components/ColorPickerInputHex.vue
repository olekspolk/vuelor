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
    : Math.round(rootContext.alpha.value * 100)
})

function handleHexInput(e: Event) {
  const target = e.target as HTMLInputElement
  const rgba = target.value ? parseHex(target.value) : null
  if (!rgba) {
    target.value = hexValue.value as string
    return
  }
  // The hex field shows only the 6 RGB digits — the sibling opacity field owns
  // alpha — and parseHex forces a=1 for 3/6-digit input. So a plain edit must
  // keep the existing alpha; only an explicitly typed 4/8-digit value sets it.
  const digits = target.value.trim().replace('#', '')
  const typedAlpha = digits.length === 4 || digits.length === 8
  if (hasVModel.value) {
    // Read the bound alpha back via parseHex (not getAlphaFromHexString, which
    // quantizes to whole percents) so a no-op blur stays bit-exact.
    const current = props.modelValue ? parseHex(props.modelValue) : null
    const a = typedAlpha ? rgba.a : current?.a ?? 1
    const next = RGBAtoHexa({ ...rgba, a })
    if (next !== props.modelValue) {
      emit('update:modelValue', next)
    } else {
      target.value = hexValue.value as string
    }
  } else {
    // Write RGB only (the rgb setter leaves alpha untouched); apply a typed
    // alpha through the rgba setter.
    if (typedAlpha) {
      rootContext.rgba.value = rgba
    } else {
      rootContext.rgb.value = { r: rgba.r, g: rgba.g, b: rgba.b }
    }
    rootContext.commitValue()
  }
}

function handleAlphaInput(e: Event) {
  const target = e.target as HTMLInputElement
  const intValue = parseInt(target.value, 10)
  if (hasVModel.value) {
    const currentAlpha = alphaValue.value ?? 100
    const value = isNaN(intValue) ? currentAlpha : clamp(intValue, 0, 100)
    // Re-emitting the displayed percent would drift the stored alpha byte, so
    // treat an unchanged percent (tab-through) as a no-op and only normalize
    // the field; otherwise compose the bound RGB with the new alpha.
    if (value === currentAlpha) {
      target.value = value.toString()
      return
    }
    const current = props.modelValue ? parseHex(props.modelValue) : null
    const rgb = current ?? { r: 0, g: 0, b: 0, a: 1 }
    emit('update:modelValue', RGBAtoHexa({ r: rgb.r, g: rgb.g, b: rgb.b, a: value / 100 }))
    return
  }
  const currentPercent = Math.round(rootContext.alpha.value * 100)
  const value = isNaN(intValue) ? currentPercent : clamp(intValue, 0, 100)
  if (currentPercent !== value) {
    rootContext.alpha.value = value / 100
    rootContext.commitValue()
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
