<script lang="ts" setup>
import { computed } from 'vue'
import {
  ColorPickerRoot,
  ColorPickerInputRGB,
  ColorPickerSliderRed,
  ColorPickerSliderGreen,
  ColorPickerSliderBlue,
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
    class="p-3 pl-2"
    format="object"
    v-model="color"
  >
    <div class="flex gap-2">
      <ColorPickerInputRGB
        :ui="{
          group: 'flex-col w-12',
          label: 'block w-5',
          item: 'bg-transparent last:flex-row-reverse'
        }"
      />
      <div class="flex flex-col justify-around flex-1">
        <ColorPickerSliderRed />
        <ColorPickerSliderGreen />
        <ColorPickerSliderBlue />
        <ColorPickerSliderAlpha />
      </div>
    </div>
  </ColorPickerRoot>
</template>
