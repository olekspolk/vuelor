<script lang="ts" setup>
import { computed } from 'vue'
import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerEyeDropper,
  ColorPickerSliderHue,
  ColorPickerSliderAlpha,
  ColorPickerInputHex,
  ColorPickerSwatch,
  type ColorObject
} from '@vuelor/picker'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger
} from 'reka-ui'

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
    class="p-0 rounded-none bg-transparent !shadow-none w-auto"
    :ui="{
      shared: { thumb: 'border-2 h-3 w-3' },
      slider: { track: 'h-3' },
      input: { item: 'bg-white', field: 'max-w-16' }
    }"
  >
    <PopoverRoot>
      <ColorPickerInputHex class="w-52 shadow bg-[#f5f5f5] rounded-[5px]" >
        <template #before>
          <PopoverTrigger as-child>
            <ColorPickerSwatch :value="color?.hexa ?? '#B63DDAFF'" />
          </PopoverTrigger>
        </template>
      </ColorPickerInputHex>

      <PopoverPortal>
        <PopoverContent
          align="start"
          :sideOffset="5"
          :alignOffset="-4"
          class="bg-white rounded-[5px] shadow-vuelor-card"
        >
          <ColorPickerCanvas :ui="{ area: 'rounded-none rounded-t-[5px]' }" />
          <div class="p-3 flex items-center gap-3">
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
