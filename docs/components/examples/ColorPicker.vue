<script lang="ts" setup>
import { ref, computed } from 'vue'
import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerEyeDropper,
  ColorPickerSliderHue,
  ColorPickerSliderAlpha,
  ColorPickerInputHex,
  ColorPickerInputHSL,
  ColorPickerInputRGB,
  ColorPickerInputHSB,
  type ColorObject
} from '@vuelor/picker'

import Select from '../common/Select.vue'

const INPUTS = {
  Hex: ColorPickerInputHex,
  RGB: ColorPickerInputRGB,
  HSL: ColorPickerInputHSL,
  HSB: ColorPickerInputHSB
}

type ModelValue = ColorObject | string | null

interface Props {
  class?: string
  disabled?: boolean
  modelValue?: ModelValue
  format?: 'object' | 'hex'
}

const props = withDefaults(defineProps<Props>(), {
  format: 'object',
  modelValue: null,
  disabled: false
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

const format = ref<'Hex' | 'RGB' | 'HSL' | 'HSB'>('Hex')
const formatOptions = ['Hex', 'RGB', 'HSL', 'HSB']

const canvasType = computed<'HSL' | 'HSV'>(() => {
  return format.value === 'HSL' ? 'HSL' : 'HSV'
})
</script>

<template>
  <ColorPickerRoot
    v-model="color"
    :class="props.class"
    :format="props.format"
    :disabled="props.disabled"
    :ui="{ input: { label: 'hidden' } }"
  >
    <ColorPickerCanvas :type="canvasType" />
    <div class="flex items-center gap-3">
      <ColorPickerEyeDropper>
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17.52 6.471a1.62 1.62 0 0 0-2.295.003l-1.87 1.88-.354.355-.355-.354-.01-.01a.9.9 0 0 0-1.272 0l-.02.02a.9.9 0 0 0 0 1.273l.51.51 2 2 .51.51a.9.9 0 0 0 1.272 0l.02-.02a.9.9 0 0 0 0-1.273l-.01-.01-.352-.353.351-.353 1.879-1.888a1.62 1.62 0 0 0-.003-2.29m-3.004-.702a2.621 2.621 0 1 1 3.717 3.697l-1.57 1.579a1.9 1.9 0 0 1-.3 2.3l-.02.02a1.9 1.9 0 0 1-2.687 0l-.156-.157-5.647 5.642a.5.5 0 0 1-.353.147H5.504a.5.5 0 0 1-.5-.5L5 16.503a.5.5 0 0 1 .146-.354l5.647-5.647-.157-.156a1.9 1.9 0 0 1 0-2.687l.02-.02a1.9 1.9 0 0 1 2.299-.3zm-3.016 5.44 1.293 1.292-5.5 5.496h-1.29L6 16.707z"
          />
        </svg>
      </ColorPickerEyeDropper>
      <div class="flex flex-col flex-1 gap-2">
        <ColorPickerSliderHue />
        <ColorPickerSliderAlpha />
      </div>
    </div>
    <div class="flex items-center gap-2">
      <Select
        v-model="format"
        class="w-[56px]"
        label="Color Format"
        placeholder="Format"
        :disabled="props.disabled"
        :options="formatOptions"
      />
      <component :is="INPUTS[format]" />
    </div>
  </ColorPickerRoot>
</template>
