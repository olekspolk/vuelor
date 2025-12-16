<script lang="ts" setup>
import { ref, computed, useTemplateRef } from 'vue'
import { TabsRoot, TabsContent, TabsList, TabsTrigger } from 'reka-ui'
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
  ColorPickerSwatch,
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

const format = ref<string>('hex')

const canvasType = computed<'HSL' | 'HSV'>(() => {
  return format.value === 'hsl' ? 'HSL' : 'HSV'
})

const shatches = ref<string[]>([
  '#00C3D0FF',
  '#00C8B3FF',
  '#34C759FF',
  '#FFCC00FF',
  '#FF383CFF',
  '#FF8D2825',
  '#FF383C40',
  '#FF8D2880',
  '#FFCC0080',
  '#34C759FF',
  '#00C8B3FF',
  '#00C3D0FF',
  '#0088FFFF',
  '#6155F5FF',
  '#CB30E0FF',
  '#FF2D55FF',
  '#FF2D5525',
  '#AC7F5EFF'
])

const colorPicker = useTemplateRef<typeof ColorPickerRoot>('colorPicker')
</script>

<template>
  <ColorPickerRoot
    v-model="color"
    ref="colorPicker"
    format="object"
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
      <TabsRoot
        v-model="format"
        default-value="hex"
      >
        <TabsList class="w-full grid grid-cols-4 items-center justify-center rounded-[7px] bg-[#f5f5f5] p-0.5">
          <TabsTrigger class="h-6 inline-flex items-center justify-center whitespace-nowrap rounded-[5px] px-1 py-0.5 text-[10px] font-medium focus-within:outline-1 focus-within:outline-[#0d99ff] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:shadow" value="hex">Hex</TabsTrigger>
          <TabsTrigger class="h-6 inline-flex items-center justify-center whitespace-nowrap rounded-[5px] px-1 py-0.5 text-[10px] font-medium focus-within:outline-1 focus-within:outline-[#0d99ff] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:shadow" value="rgb">RGB</TabsTrigger>
          <TabsTrigger class="h-6 inline-flex items-center justify-center whitespace-nowrap rounded-[5px] px-1 py-0.5 text-[10px] font-medium focus-within:outline-1 focus-within:outline-[#0d99ff] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:shadow" value="hsl">HSL</TabsTrigger>
          <TabsTrigger class="h-6 inline-flex items-center justify-center whitespace-nowrap rounded-[5px] px-1 py-0.5 text-[10px] font-medium focus-within:outline-1 focus-within:outline-[#0d99ff] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:shadow" value="hsb">HSB</TabsTrigger>
        </TabsList>
        <TabsContent class="mt-2" value="hex">
          <ColorPickerInputHex />
        </TabsContent>
        <TabsContent class="mt-2" value="rgb">
          <ColorPickerInputRGB />
        </TabsContent>
        <TabsContent class="mt-2" value="hsl">
          <ColorPickerInputHSL />
        </TabsContent>
        <TabsContent class="mt-2" value="hsb">
          <ColorPickerInputHSB />
        </TabsContent>
      </TabsRoot>
    </div>
    <div class="border-t -mx-4 px-3 pt-2 grid grid-cols-9">
      <ColorPickerSwatch
        v-for="color in shatches"
        :value="color"
        class="m-1"
        @click="colorPicker && (colorPicker.color.hexa.value = color)"
      />
    </div>
  </ColorPickerRoot>
</template>
