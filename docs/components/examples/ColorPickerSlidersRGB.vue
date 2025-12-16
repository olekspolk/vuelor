<script lang="ts" setup>
import { computed } from 'vue'
import {
  ColorPickerRoot,
  ColorPickerInputRGB,
  ColorPickerSliderRed,
  ColorPickerSliderGreen,
  ColorPickerSliderBlue,
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
    class="p-3 pl-2"
    :ui="{ shared: { thumb: 'border-2' } }"
  >
    <div class="flex gap-2">
      <ColorPickerInputRGB
        :ui="{
          group: 'flex-col w-12',
          item: 'bg-transparent last:flex-row-reverse',
          label: 'w-5'
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
