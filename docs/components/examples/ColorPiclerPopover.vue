<script lang="ts" setup>
import { computed } from 'vue'
import type { ColorObject } from '@vuelor/picker'

import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerEyeDropper,
  ColorPickerSliderHue,
  ColorPickerSliderAlpha,
  ColorPickerInputHex
} from '@vuelor/picker'

import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger
} from 'reka-ui'

interface Props {
  modelValue: ColorObject | string | null
}

const props = withDefaults(defineProps<Props>(), {
  format: 'object'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: ColorObject | string | null): void
}>()

const color = computed({
  get: () => props.modelValue,
  set: (value: ColorObject | string | null) => {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <ColorPickerRoot
    format="object"
    class="p-0 rounded-none bg-transparent shadow-none w-auto"
    :ui="{
      shared: { thumb: 'border' },
      slider: { track: 'h-3' },
      input: { label: 'block', item: 'bg-white' }
    }"
    v-model="color"
  >
    <PopoverRoot>
      <ColorPickerInputHex class="w-52 shadow bg-[#f5f5f5]" >
        <template #before>
          <PopoverTrigger class="px-1 rounded-l-[5px] bg-white">
            <div class="w-[18px] h-[18px] rounded-[3px] bg-red-500" />
          </PopoverTrigger>
        </template>
      </ColorPickerInputHex>

      <PopoverPortal>
        <PopoverContent
          align="start"
          class="vuelor bg-white rounded shadow-lg"
        >
          <ColorPickerCanvas :ui="{ area: 'rounded-none rounded-t' }" />
          <div class="p-3 pl-2 flex items-center gap-3">
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
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </ColorPickerRoot>
</template>
