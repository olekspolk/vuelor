<script lang="ts" setup>
import { computed } from 'vue'
import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerSliderHue,
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
    format="object"
    class="flex-row gap-3 w-auto"
  >
    <ColorPickerCanvas />
    <ColorPickerSliderHue orientation="vertical" />
    <ColorPickerSliderAlpha orientation="vertical" />
  </ColorPickerRoot>
</template>
