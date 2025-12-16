<script lang="ts" setup>
import { computed } from 'vue'
import {
  ColorPickerRoot,
  ColorPickerInputHSL,
  ColorPickerSliderHue,
  ColorPickerSliderSaturation,
  ColorPickerSliderLightness,
  ColorPickerSliderAlpha,
  type ColorObject
} from '@vuelor/picker'

type ModelValue = ColorObject | null

const props = withDefaults(defineProps<{ modelValue?: ModelValue }>(), {
  modelValue: null
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: ModelValue): void
}>()

const color = computed({
  get: () => props.modelValue,
  set: (value: ModelValue) => {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <ColorPickerRoot
    v-model="color"
    class="p-3"
    format="object"
    :ui="{ shared: { thumb: 'border-2' } }"
  >
    <ColorPickerSliderHue />
    <ColorPickerSliderSaturation />
    <ColorPickerSliderLightness />
    <ColorPickerSliderAlpha />
    <ColorPickerInputHSL :ui="{ item: 'bg-transparent' }" />
  </ColorPickerRoot>
</template>
