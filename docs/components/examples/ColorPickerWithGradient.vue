<script lang="ts" setup>
import { ref, computed } from 'vue'
import { SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'

import type { ColorObject } from '@vuelor/picker'
import { ColorPickerInputHex, ColorPickerInputHSL, ColorPickerInputRGB, ColorPickerInputHSB } from '@vuelor/picker'
import { ColorPickerRoot, ColorPickerCanvas, ColorPickerEyeDropper, ColorPickerSwatch } from '@vuelor/picker'
import { ColorPickerSliderHue, ColorPickerSliderAlpha } from '@vuelor/picker'

import ColorPickerFormat from '../examples/ColorPickerFormat.vue'

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
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: ModelValue): void
}>()

const format = ref<'Hex' | 'RGB' | 'HSL' | 'HSB'>('Hex')
const formatOptions = ['Hex', 'RGB', 'HSL', 'HSB']

const canvasType = computed<'HSL' | 'HSV'>(() => {
  return format.value === 'HSL' ? 'HSL' : 'HSV'
})

const color = ref(null)
const mode = ref('gradient')
const gradientType = ref('linear')
const gradientAngle = ref(90)

const stops = ref([20, 70])
const colors = ['#FD4890', '#F2EA14']

const trackBackground = computed(() => {
  const stopsList = stops.value.map((value, index) => `${colors[index]} ${value}%`).join(', ')
  return `${gradientType.value}-gradient(to right, ${stopsList})`
})
</script>

<template>
  <ColorPickerRoot
    v-model="color"
    :class="props.class"
    :format="props.format"
    :ui="{
      input: { label: 'hidden' }
    }"
    class="block p-0"
  >
    <TabsRoot
      v-model="mode"
      default-value="color"
    >
      <TabsList class="flex gap-1 p-2 border-b">
        <TabsTrigger class="h-6 w-6 rounded-sm data-[state=active]:bg-[#f5f5f5]" value="color">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path fill="#0000004d" d="M9 9h6v6H9z" />
            <path fill="#000000e6" fill-rule="evenodd" clip-rule="evenodd" d="M8 7h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1M6 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2zm3 7V9h6v6zM8 8.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5z" />
          </svg>
        </TabsTrigger>
        <TabsTrigger class="h-6 w-6 rounded-sm data-[state=active]:bg-[#f5f5f5]" value="gradient">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path fill="#000000e6" fill-rule="evenodd" clip-rule="evenodd" d="M8 7h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1M6 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2zm3.75.875a.875.875 0 1 1-1.75 0 .875.875 0 0 1 1.75 0m3.791.625a.625.625 0 1 0 0-1.25.625.625 0 0 0 0 1.25m-1.458.875a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m0 3.12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.458 2.245a.625.625 0 1 0 0-1.25.625.625 0 0 0 0 1.25m.625-3.865a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0M8.875 15.99a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75m.875-4.115a.875.875 0 1 1-1.75 0 .875.875 0 0 1 1.75 0m5.75-1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m.5 2.623a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
          </svg>
        </TabsTrigger>
      </TabsList>
      <TabsContent class="p-4" value="color">
        <div class="flex flex-col gap-2">
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
            <ColorPickerFormat
              v-model="format"
              :disabled="props.disabled"
              :options="formatOptions"
            />
            <component :is="INPUTS[format]" />
          </div>
        </div>
      </TabsContent>
      <TabsContent class="pb-3" value="gradient">
        <div class="pt-4 px-4">
          <SliderRoot
            v-model="stops"
            class="relative flex items-center select-none touch-none"
            thumbAlignment="overflow"
          >
            <SliderTrack
              :style="{ background: trackBackground }"
              class="relative grow rounded-[5px] h-8 shadow-vuelor-inner"
            />
            <SliderThumb
              v-for="(_, i) in stops.length"
              aria-label="Stop"
              class="flex items-center justify-center w-6 h-6 -mt-8 bg-white drop-shadow-vuelor-thumb rounded-[5px] focus:outline-none focus:bg-[#0d99ff] relative after:content-[''] after:absolute after:top-[100%] after:left-1/2 after:-translate-x-1/2 after:border-l-[6px] after:border-l-transparent after:border-r-[6px] after:border-r-transparent after:border-t-[6px] after:border-t-white focus:after:border-t-[#0d99ff]"
            >
              <ColorPickerSwatch as="span" class="w-3.5 h-3.5 border border-[#0000001a] rounded-sm" :value="colors[i]" />
            </SliderThumb>
          </SliderRoot>
        </div>
        <div class="h-8 pl-4 pr-2 mt-2 mb-1 flex items-center justify-between">
          <span class="text-black text-[11px] font-bold">Stops</span>
          <button class="rounded-[5px] hover:bg-[#f5f5f5]">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 6a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 12 6"
              />
            </svg>
          </button>
        </div>
        <div
          v-for="(stop, index) in stops"
          class="h-8 pl-4 pr-2 flex items-center gap-2"
        >
          <div class="w-12 flex flex-grow-0 rounded-[5px] enabled:hover:outline-1 outline-[#e6e6e6] focus-within:outline-1 focus-within:outline-[#0d99ff] data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            <div class="flex flex-1 data-[alpha-input]:grow-0 items-center px-1.5 gap-1 bg-[#f5f5f5] rounded-[5px]">
              <input
                type="text"
                :value="`${stop}%`"
                class="w-full h-6 min-w-5 text-[11px] focus:outline-none"
              >
            </div>
          </div>
          <ColorPickerInputHex class="flex-1">
            <template #before>
              <ColorPickerSwatch :value="colors[index]" />
            </template>
          </ColorPickerInputHex>
          <button class="rounded-[5px] hover:bg-[#f5f5f5]">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6 12a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 6 12"
              />
            </svg>
          </button>
        </div>
      </TabsContent>
    </TabsRoot>
  </ColorPickerRoot>
</template>
