<script lang="ts" setup>
import { computed } from 'vue'
import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerSliderHue,
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
