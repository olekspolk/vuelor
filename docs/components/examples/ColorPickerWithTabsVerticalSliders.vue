<script lang="ts" setup>
import { ref, computed, useTemplateRef } from 'vue'
import { TabsRoot, TabsList, TabsTrigger } from 'reka-ui'
import type { ColorObject } from '@vuelor/picker'

import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerEyeDropper,
  ColorPickerSliderHue,
  ColorPickerSliderAlpha,
  ColorPickerInputHex,
  ColorPickerInputHSL,
  ColorPickerInputRGB,
  ColorPickerInputHSB
} from '@vuelor/picker'

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

const INPUTS = {
  hex: ColorPickerInputHex,
  rgb: ColorPickerInputRGB,
  hsl: ColorPickerInputHSL,
  hsb: ColorPickerInputHSB
}

const format = ref<string>('rgb')

const canvasType = computed<'HSL' | 'HSV'>(() => {
  return format.value === 'hsl' ? 'HSL' : 'HSV'
})

const shatches = ref<string[]>([
  '#FF6900',
  '#FCB900',
  '#7BDCB5',
  '#00D084',
  '#8ED1FC',
  '#0693E3',
  '#ABB8C3',
  '#EB144C',
  '#F78DA7',
  '#9900EF'
])

const colorPicker = useTemplateRef<typeof ColorPickerRoot>('colorPicker')
</script>

<template>
  <ColorPickerRoot
    ref="colorPicker"
    v-model="color"
    format="object"
    class="w-[295px] p-0 gap-0"
    :ui="{
      input: {
        group: '!outline-none gap-2',
        item: '!rounded-[6px] hover:outline-1 outline-[#e6e6e6] focus-within:outline-1 focus-within:outline-[#0d99ff]'
      },
      shared: {
        thumb: 'border-[3px] w-3.5 h-3.5'
      },
      canvas: {
        area: 'rounded-lg'
      },
      slider: {
        track: 'w-4'
      }
    }"
  >
    <div class="pt-4 px-4 pb-3 flex flex-col gap-3">
      <div class="flex gap-3">
        <ColorPickerCanvas :type="canvasType" />
        <ColorPickerSliderHue orientation="vertical" />
        <ColorPickerSliderAlpha orientation="vertical" />
      </div>
      <TabsRoot
        v-model="format"
        default-value="hex"
      >
        <TabsList class="grid grid-cols-4 items-center justify-center rounded-[7px] bg-[#f5f5f5] p-0.5 w-full">
          <TabsTrigger class="h-6 inline-flex items-center justify-center rounded-[5px] px-1 py-0.5 text-[11px] font-medium focus-within:outline-1 focus-within:outline-[#0d99ff] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:shadow" value="hex">Hex</TabsTrigger>
          <TabsTrigger class="h-6 inline-flex items-center justify-center rounded-[5px] px-1 py-0.5 text-[11px] font-medium focus-within:outline-1 focus-within:outline-[#0d99ff] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:shadow" value="rgb">RGB</TabsTrigger>
          <TabsTrigger class="h-6 inline-flex items-center justify-center rounded-[5px] px-1 py-0.5 text-[11px] font-medium focus-within:outline-1 focus-within:outline-[#0d99ff] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:shadow" value="hsl">HSL</TabsTrigger>
          <TabsTrigger class="h-6 inline-flex items-center justify-center rounded-[5px] px-1 py-0.5 text-[11px] font-medium focus-within:outline-1 focus-within:outline-[#0d99ff] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:shadow" value="hsb">HSB</TabsTrigger>
        </TabsList>
      </TabsRoot>
      <div class="flex items-center gap-3">
        <ColorPickerEyeDropper class="p-0">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M17.52 6.471a1.62 1.62 0 0 0-2.295.003l-1.87 1.88-.354.355-.355-.354-.01-.01a.9.9 0 0 0-1.272 0l-.02.02a.9.9 0 0 0 0 1.273l.51.51 2 2 .51.51a.9.9 0 0 0 1.272 0l.02-.02a.9.9 0 0 0 0-1.273l-.01-.01-.352-.353.351-.353 1.879-1.888a1.62 1.62 0 0 0-.003-2.29m-3.004-.702a2.621 2.621 0 1 1 3.717 3.697l-1.57 1.579a1.9 1.9 0 0 1-.3 2.3l-.02.02a1.9 1.9 0 0 1-2.687 0l-.156-.157-5.647 5.642a.5.5 0 0 1-.353.147H5.504a.5.5 0 0 1-.5-.5L5 16.503a.5.5 0 0 1 .146-.354l5.647-5.647-.157-.156a1.9 1.9 0 0 1 0-2.687l.02-.02a1.9 1.9 0 0 1 2.299-.3zm-3.016 5.44 1.293 1.292-5.5 5.496h-1.29L6 16.707z"
            />
          </svg>
        </ColorPickerEyeDropper>
        <component :is="INPUTS[format]" />
      </div>
    </div>
    <div class="border-t p-4 flex flex-wrap gap-[7px]">
      <button
        v-for="color in shatches"
        :style="{ backgroundColor: color }"
        class="h-5 w-5 rounded-[4px] hover:outline-1 outline-[#e6e6e6] focus-within:outline-1 focus-within:outline-[#0d99ff]"
        @click="colorPicker && (colorPicker.color.hex.value = color)"
      />
    </div>
  </ColorPickerRoot>
</template>
