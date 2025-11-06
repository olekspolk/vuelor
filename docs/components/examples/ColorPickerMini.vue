<script lang="ts" setup>
import { computed } from 'vue'
import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerSliderHue
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
    class="bg-transparent p-0 !shadow-none gap-3 w-auto"
    v-model="color"
  >
    <ColorPickerCanvas
      :ui="{
        area: 'rounded-lg',
        thumb: 'h-6 w-6 border'
      }"
    />
    <ColorPickerSliderHue :ui="{ thumb: 'border' }" />
  </ColorPickerRoot>
</template>
