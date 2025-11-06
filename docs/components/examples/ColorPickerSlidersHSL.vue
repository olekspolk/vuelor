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
    class="p-3"
    format="object"
    v-model="color"
  >
    <ColorPickerSliderHue />
    <ColorPickerSliderSaturation />
    <ColorPickerSliderLightness />
    <ColorPickerSliderAlpha />
    <ColorPickerInputHSL
      :ui="{
        label: 'block',
        item: 'bg-transparent'
      }"
    />
  </ColorPickerRoot>
</template>
