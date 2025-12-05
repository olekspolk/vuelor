<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { twMerge } from 'tailwind-merge'
import { createReusableTemplate } from '@vueuse/core'
import { SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { ColorPickerInputHex, ColorPickerInputHSL, ColorPickerInputRGB, ColorPickerInputHSB } from '@vuelor/picker'
import { ColorPickerRoot, ColorPickerCanvas, ColorPickerEyeDropper, ColorPickerSwatch } from '@vuelor/picker'
import { ColorPickerSliderHue, ColorPickerSliderAlpha } from '@vuelor/picker'
import { HexaToRGBA, RGBAtoHexa } from '@vuelor/picker'

import Select from '../common/Select.vue'
import GradientStopInput from '../common/GradientStopInput.vue'

const [DefineColorPickerTemplate, ColorPicker] = createReusableTemplate()

const INPUTS = {
  Hex: ColorPickerInputHex,
  RGB: ColorPickerInputRGB,
  HSL: ColorPickerInputHSL,
  HSB: ColorPickerInputHSB
}

type ModelValue = string | null

interface Props {
  class?: string
  disabled?: boolean
  modelValue?: ModelValue
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  modelValue: null
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: ModelValue): void
}>()

const format = ref<'Hex' | 'RGB' | 'HSL' | 'HSB'>('Hex')
const formatOptions = ['Hex', 'RGB', 'HSL', 'HSB']

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

const canvasType = computed<'HSL' | 'HSV'>(() => {
  return format.value === 'HSL' ? 'HSL' : 'HSV'
})

const color = ref<string | null>(null)
const mode = ref<'color' | 'gradient'>('color')

const gradientType = ref('Linear')
const gradientTypeOptions = ['Linear', 'Radial', 'Conic']

const gradientAngle = ref(90)
const gradientStops = ref([0, 33, 66, 100])
const gradientSelectedStopIndex = ref(0)
const gradientColors = ref(['#FF98C2FF', '#4DC1FFFF', '#D082E8FF', '#FFFA7AFF'])

const currentColor = computed<ModelValue>({
  get: () => {
    return mode.value === 'color'
      ? color.value
      : gradientColors.value[gradientSelectedStopIndex.value]
  },
  set: (value: ModelValue) => {
    if (mode.value === 'color') {
      color.value = value as string
    } else {
      gradientColors.value[gradientSelectedStopIndex.value] = value as string
    }
  }
})

function addStop () {
    const lastIndex = gradientStops.value.length - 1
    const prevIndex = gradientStops.value.length > 1 ? gradientStops.value.length - 2 : 0

    const newStop = gradientStops.value.length > 1
      ? ((gradientStops.value[lastIndex] + gradientStops.value[prevIndex]) / 2)
      : gradientStops.value[lastIndex] <= 50 ? 100 : 0

    const colorA = HexaToRGBA(gradientColors.value[prevIndex])
    const colorB = HexaToRGBA(gradientColors.value[lastIndex])

    const newColor = RGBAtoHexa({
      r: (colorA.r + colorB.r) / 2,
      g: (colorA.g + colorB.g) / 2,
      b: (colorA.b + colorB.b) / 2,
      a: (colorA.a + colorB.a) / 2
    })

    const insertIndex = (gradientStops.value.length === 1) ? 1 : lastIndex
    gradientStops.value.splice(insertIndex, 0, Math.round(newStop))
    gradientStops.value = gradientStops.value.sort((a, b) => a - b)
    gradientColors.value.splice(insertIndex, 0, newColor)
};

function removeStop (index: number) {
  if (gradientStops.value.length < 2) return
  gradientSelectedStopIndex.value = index > 0 ? index - 1 : 0
  gradientStops.value.splice(index, 1)
  gradientColors.value.splice(index, 1)
}

function handleSelectStop (index: number) {
  gradientSelectedStopIndex.value = index
}

function handleReverseGradient () {
  gradientColors.value.reverse()
}

function handleRotateGradient () {
  gradientAngle.value = (gradientAngle.value + 90) % 360
}

const gradientStopsList = computed(() => {
  return gradientStops.value.map((value, index) => `${gradientColors.value[index]} ${value}%`).join(', ')
})

const trackBackground = computed(() => {
  return `linear-gradient(to right, ${gradientStopsList.value})`
})

const modelValue = computed(() => {
  if (mode.value === 'color') {
    return color.value
  }

  switch (gradientType.value) {
    case 'Radial':
      return `radial-gradient(circle at center, ${gradientStopsList.value})`
    case 'Conic':
      return `conic-gradient(from ${gradientAngle.value}deg, ${gradientStopsList.value})`
    case 'Linear':
    default:
      return `linear-gradient(${gradientAngle.value}deg, ${gradientStopsList.value})`
  }
})

watch(
  modelValue,
  (newValue) => emit('update:modelValue', newValue),
  { immediate: true }
)
</script>

<template>
  <ColorPickerRoot
    v-model="currentColor"
    class="block p-0"
    :class="props.class"
    :disabled="props.disabled"
    :ui="{ input: { label: 'hidden', field: 'max-w-12' } }"
  >
    <DefineColorPickerTemplate>
      <div class="p-4 flex flex-col gap-2">
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
            label="Color format"
            placeholder="Format"
            :disabled="props.disabled"
            :options="formatOptions"
          />
          <component :is="INPUTS[format]" />
        </div>
      </div>
      <div class="border-t px-3 py-2 grid grid-cols-9">
        <ColorPickerSwatch
          v-for="color in shatches"
          :value="color"
          class="m-1"
          @click="currentColor = color"
        />
      </div>
    </DefineColorPickerTemplate>

    <TabsRoot
      v-model="mode"
      default-value="color"
    >
      <div class="flex justify-between p-2 border-b">
        <TabsList class="flex gap-1">
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

        <button class="h-6 w-6 rounded-[5px] hover:bg-[#f5f5f5] focus:outline focus:outline-[#0d99ff]">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path fill="#000000e6" d="M16.224 7.082a.501.501 0 0 1 .694.693l-.065.078L12.707 12l4.146 4.146.064.078a.5.5 0 0 1-.693.694l-.078-.065L12 12.706l-4.147 4.147a.5.5 0 1 1-.707-.707l4.147-4.147-4.147-4.146-.064-.078a.501.501 0 0 1 .693-.693l.078.064L12 11.293l4.146-4.147z" />
          </svg>
        </button>
      </div>

      <TabsContent value="color">
        <ColorPicker />
      </TabsContent>
      <TabsContent class="pb-3" value="gradient">
        <div class="h-12 pl-4 pr-2 flex items-center justify-between gap-2">
          <Select
            v-model="gradientType"
            class="w-24"
            label="Gradient type"
            placeholder="Type"
            :disabled="props.disabled"
            :options="gradientTypeOptions"
          />
          <div class="flex items-center gap-1">
            <button
              :disabled="gradientStops.length === 1"
              class="rounded-[5px] enabled:hover:bg-[#f5f5f5] disabled:opacity-50 focus:outline focus:outline-[#0d99ff]"
              @click="handleReverseGradient"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" d="M8.354 6.354a.5.5 0 1 0-.708-.708l-2.5 2.5a.5.5 0 0 0 0 .708l2.5 2.5a.5.5 0 0 0 .708-.708L6.707 9H18.5a.5.5 0 0 0 0-1H6.707zm7.292 7a.5.5 0 0 1 .708-.708l2.5 2.5a.5.5 0 0 1 0 .708l-2.5 2.5a.5.5 0 0 1-.708-.708L17.293 16H5.5a.5.5 0 0 1 0-1h11.793z" />
              </svg>
            </button>

            <button
              :disabled="gradientType === 'Radial'"
              class="rounded-[5px] enabled:hover:bg-[#f5f5f5] disabled:opacity-50 focus:outline focus:outline-[#0d99ff]"
              @click="handleRotateGradient"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" fill-rule="evenodd" d="M10.233 6.474a2.5 2.5 0 0 1 3.535 0L15.293 8H14a.5.5 0 0 0 0 1h2.5a.5.5 0 0 0 .5-.5V6a.5.5 0 1 0-1 0v1.292l-1.525-1.525a3.5 3.5 0 0 0-4.95 0L7.147 8.146a.5.5 0 0 0 .707.707zm2.828 3.172a1.5 1.5 0 0 0-2.121 0l-3.293 3.293a1.5 1.5 0 0 0 0 2.121l3.293 3.293a1.5 1.5 0 0 0 2.12 0l3.294-3.293a1.5 1.5 0 0 0 0-2.121zm-1.414.707a.5.5 0 0 1 .707 0l3.293 3.293a.5.5 0 0 1 0 .707l-3.293 3.293a.5.5 0 0 1-.707 0l-3.293-3.293a.5.5 0 0 1 0-.707z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="pt-4 px-4">
          <SliderRoot
            v-model="gradientStops"
            class="relative flex items-center select-none touch-none"
            thumbAlignment="overflow"
          >
            <SliderTrack
              :style="{ background: trackBackground }"
              class="relative grow rounded-[5px] h-8 shadow-vuelor-inner"
            />
            <SliderThumb
              v-for="(_, i) in gradientStops.length"
              aria-label="Stop"
              :class="twMerge(['flex items-center justify-center w-6 h-6 -mt-8 bg-white drop-shadow-vuelor-thumb rounded-[5px] focus:outline-none relative after:content-[\'\'] after:absolute after:top-[100%] after:left-1/2 after:-translate-x-1/2 after:border-l-[6px] after:border-l-transparent after:border-r-[6px] after:border-r-transparent after:border-t-[6px] after:border-t-white', gradientSelectedStopIndex === i ? 'bg-[#0d99ff] after:border-t-[#0d99ff]' : ''])"
              @pointerdown="handleSelectStop(i)"
            >
              <ColorPickerSwatch
                as="span"
                class="w-3.5 h-3.5 border border-[#0000001a] rounded-sm"
                :value="gradientColors[i]"
              />
            </SliderThumb>
          </SliderRoot>
        </div>
        <div class="h-8 pl-4 pr-2 mt-2 mb-1 flex items-center justify-between">
          <span class="text-black text-[11px] font-bold">Stops</span>
          <button
            :disabled="gradientStops.length > 7"
            class="rounded-[5px] enabled:hover:bg-[#f5f5f5] disabled:opacity-50 focus:outline focus:outline-[#0d99ff]"
            @click="addStop"
          >
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
          v-for="(_, index) in gradientStops"
          :class="{ 'bg-[#e5f4ff]': gradientSelectedStopIndex === index }"
          class="h-8 pl-4 pr-2 flex items-center gap-2"
          @mousedown="handleSelectStop(index)"
        >
          <GradientStopInput v-model="gradientStops[index]" />
          <ColorPickerInputHex class="flex-1" v-model="gradientColors[index]">
            <template #before>
              <PopoverRoot>
                <PopoverTrigger as-child>
                  <ColorPickerSwatch
                    :value="gradientColors[index]"
                    @click="gradientSelectedStopIndex = index"
                  />
                </PopoverTrigger>
                <PopoverPortal>
                  <PopoverContent
                    side="left"
                    align="start"
                    :alignOffset="-100"
                    :sideOffset="75"
                    data-vuelor-docs
                    class="bg-white w-60 z-10 rounded-lg shadow-vuelor-card"
                  >
                    <ColorPicker />
                  </PopoverContent>
                </PopoverPortal>
              </PopoverRoot>
            </template>
          </ColorPickerInputHex>
          <button
            class="rounded-[5px] hover:bg-[#f5f5f5] focus:outline focus:outline-[#0d99ff]"
            :style="{ visibility: gradientStops.length < 2 ? 'hidden' : undefined }"
            @click="removeStop(index)"
            @pointerdown.prevent
          >
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
