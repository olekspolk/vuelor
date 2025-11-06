<script lang="ts" setup>
import { computed } from 'vue'
import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerSliderHue,
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
    format="object"
    v-model="color"
    class="bg-transparent p-0 !shadow-none flex-row gap-3 w-auto"
  >
    <ColorPickerCanvas
      :ui="{
        area: 'rounded',
        thumb: 'border-2'
      }"
    />
    <ColorPickerSliderHue
      orientation="vertical"
      :ui="{
        track: 'rounded',
        thumb: 'w-6 h-2 border-4'
      }"
    />
    <ColorPickerSliderAlpha
      orientation="vertical"
      :ui="{
        track: 'rounded',
        thumb: 'w-6 h-2 border-4'
      }"
    />
  </ColorPickerRoot>
</template>
