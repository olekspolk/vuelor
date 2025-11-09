<script lang="ts" setup>
import { computed } from 'vue'
import {
  ColorPickerRoot,
  ColorPickerInputHSL,
  ColorPickerSliderHue,
  ColorPickerSliderSaturation,
  ColorPickerSliderLightness,
  ColorPickerSliderAlpha
} from '@vuelor/picker'
import type { ColorObject } from '@vuelor/picker'

const props = defineProps<{
  modelValue: ColorObject | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ColorObject | null): void
}>()

const color = computed({
  get: () => props.modelValue,
  set: (value: ColorObject | null) => {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <ColorPickerRoot
    v-model="color"
    class="p-3"
    format="object"
  >
    <ColorPickerSliderHue />
    <ColorPickerSliderSaturation />
    <ColorPickerSliderLightness />
    <ColorPickerSliderAlpha />
    <ColorPickerInputHSL
      :ui="{ item: 'bg-transparent' }"
    />
  </ColorPickerRoot>
</template>
