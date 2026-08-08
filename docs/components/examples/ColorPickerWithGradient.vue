<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { createReusableTemplate, useMediaQuery, useMounted } from '@vueuse/core'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { PopoverContent, PopoverPortal, PopoverRoot } from 'reka-ui'
import { ColorPickerInputHex, ColorPickerInputHSL, ColorPickerInputRGB, ColorPickerInputHSB } from '@vuelor/picker'
import { ColorPickerRoot, ColorPickerCanvas, ColorPickerEyeDropper, ColorPickerSwatch } from '@vuelor/picker'
import { ColorPickerSliderHue, ColorPickerSliderAlpha, useVModel } from '@vuelor/picker'
import { GradientPickerRoot, GradientPickerSlider, GradientPickerPositionInput } from '@vuelor/gradient'
import { GradientPickerAddStop, GradientPickerRemoveStop, GradientPickerReverse, GradientPickerRotate } from '@vuelor/gradient'
import { normalizeHexa, parseGradient, serializeGradient } from '@vuelor/gradient'
import type { GradientType, UseGradientReturn } from '@vuelor/gradient'

import ColorPickerSelect from '../common/ColorPickerSelect.vue'

const [DefineColorPickerTemplate, ColorPicker] = createReusableTemplate()

const isDesktop = useMediaQuery('(min-width: 640px)')
// The media query resolves only in the browser; gating the mobile-only picker
// on mounted keeps server and first client render identical (no hydration
// mismatch) while still unmounting the duplicate instance on desktop.
const isMounted = useMounted()

const INPUTS = {
  Hex: ColorPickerInputHex,
  RGB: ColorPickerInputRGB,
  HSL: ColorPickerInputHSL,
  HSB: ColorPickerInputHSB
}

type ModelValue = string | null
type Format = keyof typeof INPUTS

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
  (e: 'close'): void
}>()

const format = ref<Format>('Hex')
const formatOptions = Object.keys(INPUTS)

function handleFormatChange (value: string) {
  if (value in INPUTS) format.value = value as Format
}

const swatches = [
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
]

const canvasType = computed<'HSL' | 'HSV'>(() => {
  return format.value === 'HSL' ? 'HSL' : 'HSV'
})

const color = ref<string | null>(null)
const mode = ref<'color' | 'gradient'>('color')

// The gradient editor state (sorted stops, id-tracked selection, type, angle)
// lives inside GradientPickerRoot; this ref two-way binds its serialized CSS
// value and is what the gradient tab contributes to the external model.
const DEFAULT_GRADIENT = 'linear-gradient(90deg, #FF98C2FF 0%, #4DC1FFFF 33%, #D082E8FF 66%, #FFFA7AFF 100%)'
const gradientValue = ref<string>(DEFAULT_GRADIENT)

function handleModeChange (gradient: UseGradientReturn, value: string | number) {
  if (value !== 'color' && value !== 'gradient') return
  // Entering the color tab with no solid color yet: seed it from the selected
  // stop so the flip doesn't emit null (or the engine default) to the parent.
  if (value === 'color' && color.value === null) {
    color.value = gradient.selectedStop.value.color
  }
  mode.value = value
}

// The package models types as lowercase CSS keywords; the select shows them
// capitalized, matching the previous UI.
const GRADIENT_TYPE_LABELS: Record<GradientType, string> = {
  linear: 'Linear',
  radial: 'Radial',
  conic: 'Conic'
}
const gradientTypeOptions = Object.values(GRADIENT_TYPE_LABELS)

function handleGradientTypeChange (gradient: UseGradientReturn, commit: () => void, value: string) {
  const type = value.toLowerCase() as GradientType
  if (!(type in GRADIENT_TYPE_LABELS)) return
  gradient.type.value = type
  // Switching the type is a finished interaction; the root's commitValue
  // dedupes, so a re-selection of the current type stays silent.
  commit()
}

function warnUnsupported (value: string): void {
  // Locally-typed access: consumers without vite/client ambient types would
  // fail typecheck on the Vite-specific `import.meta.env`.
  const env = (import.meta as { env?: { DEV?: boolean } }).env
  if (env?.DEV) {
    console.warn(
      `[ColorPickerWithGradient] Unsupported modelValue "${value}". Accepted: #hex colors and ` +
      'linear/radial/conic gradients with #hex stops, e.g. "linear-gradient(90deg, #FF0000FF 0%, #0000FFFF 100%)".'
    )
  }
}

function applyModelValue (value: ModelValue): void {
  if (!value) return
  const input = value.trim()

  // Plain hex color (color mode)
  if (input.startsWith('#')) {
    const hexa = normalizeHexa(input)
    if (!hexa) return warnUnsupported(value)
    mode.value = 'color'
    color.value = hexa
    return
  }

  // Gradient (gradient mode). All-or-nothing like before: an unparseable
  // value warns and leaves the editor untouched. Re-serializing hands
  // GradientPickerRoot the canonical form, so the emit echo settles in one
  // round instead of two.
  const parsed = parseGradient(input)
  if (!parsed) return warnUnsupported(value)
  mode.value = 'gradient'
  gradientValue.value = serializeGradient(parsed)
}

const externalModel = useVModel(props, emit, applyModelValue)

const modelValue = computed<ModelValue>(() => {
  return mode.value === 'color' ? color.value : gradientValue.value
})

// No immediate flush: emitting during setup would overwrite the parent's value
// with our defaults before it was parsed. The null guard keeps an untouched
// color tab from nulling a bound model.
watch(modelValue, (newValue) => {
  if (newValue !== null) externalModel.value = newValue
})

// The picker edits the solid color in color mode and the selected stop (via
// the package's selectedColor bridge) in gradient mode. The picker's inputs
// round-trip alpha bit-exact and only emit on genuine changes, so a selection
// echo never loops.
function handlePickerColorChange (gradient: UseGradientReturn, value: unknown): void {
  if (typeof value !== 'string') return
  if (mode.value === 'color') {
    color.value = value
  } else {
    gradient.selectedColor.value = value
  }
}

function handleSelectStop (gradient: UseGradientReturn, id: number) {
  if (props.disabled) return
  gradient.select(id)
}

// The per-row hex fields emit when an edit lands (blur/Enter), so each
// emission is a finished stop-color interaction.
function handleStopColorChange (gradient: UseGradientReturn, commit: () => void, id: number, value: string) {
  gradient.setStopColor(id, value)
  commit()
}

// Canvas drags, sliders, inputs and swatches editing the selected stop
// signal their end through the picker's own valueCommit; forward it to the
// gradient's commit. In color mode the gradient editor is not involved.
function handlePickerColorCommit (commit: () => void) {
  if (mode.value === 'gradient') commit()
}

// The stop-color popover anchors to the panel (not the clicked stop swatch, which
// sits low in the list), so it always opens tidily to the left of the panel and
// top-aligned instead of hanging off — and over — the content below.
const panelRef = ref<HTMLElement>()
const STOP_POPOVER_SIDE_OFFSET = 12

// One shared popover for every stop, driven by the selection. Per-row popovers
// would close and reopen (a visible blink at the same anchored position) when
// clicking another stop's swatch; a single controlled popover stays mounted and
// its selection-bound content just swaps in place.
const isStopPopoverOpen = ref(false)

// "Was the popover already showing this stop?" must be sampled at pointerdown:
// the swatch's target-phase pointerdown runs before the row's bubbled mousedown
// selects the stop, so by click time the clicked stop is always the selected
// one and the toggle check could no longer tell swap from toggle-shut.
let swatchPressWasShowingStop = false

function handleStopSwatchPointerDown (gradient: UseGradientReturn, id: number) {
  swatchPressWasShowingStop = isStopPopoverOpen.value && gradient.selectedStopId.value === id
}

function handleStopSwatchClick (gradient: UseGradientReturn, id: number) {
  if (!isDesktop.value) {
    // Mobile has the inline picker; the swatch only selects.
    handleSelectStop(gradient, id)
    return
  }
  // Clicking the swatch of the stop the popover is showing toggles it shut;
  // any other swatch swaps the content in place. Keyboard activation (no
  // pointerdown) always opens; Escape is the keyboard close.
  if (swatchPressWasShowingStop) {
    isStopPopoverOpen.value = false
    swatchPressWasShowingStop = false
    return
  }
  handleSelectStop(gradient, id)
  isStopPopoverOpen.value = true
}

// Swatch clicks swap the popover content in place — they must not count as
// outside interactions. reka dismisses only when the event is not default-
// prevented, for both the pointer and focus outside paths.
function handleStopPopoverInteractOutside (event: CustomEvent<{ originalEvent: Event }>) {
  const target = event.detail?.originalEvent?.target
  if (target instanceof Element && target.closest('[data-stop-swatch]')) {
    event.preventDefault()
  }
}
</script>

<template>
  <GradientPickerRoot
    v-slot="{ gradient, commitValue }"
    v-model="gradientValue"
    :disabled="props.disabled"
    class="block w-auto gap-0 rounded-none bg-transparent p-0 shadow-none"
  >
    <ColorPickerRoot
      :model-value="mode === 'color' ? color : gradient.selectedColor.value"
      class="block p-0"
      :class="props.class"
      :disabled="props.disabled"
      :ui="{ input: { label: 'hidden', field: 'max-w-12' } }"
      @update:model-value="handlePickerColorChange(gradient, $event)"
      @value-commit="handlePickerColorCommit(commitValue)"
    >
      <DefineColorPickerTemplate>
        <div class="p-4 flex flex-col gap-2">
          <ColorPickerCanvas :type="canvasType" />
          <div class="flex items-center gap-3">
            <ColorPickerEyeDropper type="button" aria-label="Pick color from screen">
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
            <ColorPickerSelect
              :model-value="format"
              class="w-[56px]"
              label="Color format"
              placeholder="Format"
              :disabled="props.disabled"
              :options="formatOptions"
              @update:model-value="handleFormatChange"
            />
            <component :is="INPUTS[format]" />
          </div>
        </div>
        <div class="border-t px-3 py-2 grid grid-cols-9">
          <ColorPickerSwatch
            v-for="(swatch, i) in swatches"
            :key="i"
            :value="swatch"
            type="button"
            :aria-label="`Select color ${swatch}`"
            class="m-1"
          />
        </div>
      </DefineColorPickerTemplate>

      <TabsRoot
        :model-value="mode"
        @update:model-value="handleModeChange(gradient, $event)"
      >
        <div ref="panelRef" class="flex justify-between p-2 border-b">
          <TabsList class="flex gap-1">
            <TabsTrigger
              class="h-6 w-6 rounded-sm data-[state=active]:bg-vuelor-input"
              value="color"
              aria-label="Solid color"
              :disabled="props.disabled"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" fill-opacity="0.3" d="M9 9h6v6H9z" />
                <path fill="currentColor" fill-opacity="0.9" fill-rule="evenodd" clip-rule="evenodd" d="M8 7h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1M6 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2zm3 7V9h6v6zM8 8.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5z" />
              </svg>
            </TabsTrigger>
            <TabsTrigger
              class="h-6 w-6 rounded-sm data-[state=active]:bg-vuelor-input"
              value="gradient"
              aria-label="Gradient"
              :disabled="props.disabled"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" fill-opacity="0.9" fill-rule="evenodd" clip-rule="evenodd" d="M8 7h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1M6 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2zm3.75.875a.875.875 0 1 1-1.75 0 .875.875 0 0 1 1.75 0m3.791.625a.625.625 0 1 0 0-1.25.625.625 0 0 0 0 1.25m-1.458.875a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m0 3.12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.458 2.245a.625.625 0 1 0 0-1.25.625.625 0 0 0 0 1.25m.625-3.865a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0M8.875 15.99a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75m.875-4.115a.875.875 0 1 1-1.75 0 .875.875 0 0 1 1.75 0m5.75-1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m.5 2.623a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
              </svg>
            </TabsTrigger>
          </TabsList>

          <button
            type="button"
            aria-label="Close"
            class="h-6 w-6 rounded-[5px] hover:bg-vuelor-input focus:outline focus:outline-vuelor-primary"
            @click="emit('close')"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path fill="currentColor" d="M16.224 7.082a.501.501 0 0 1 .694.693l-.065.078L12.707 12l4.146 4.146.064.078a.5.5 0 0 1-.693.694l-.078-.065L12 12.706l-4.147 4.147a.5.5 0 1 1-.707-.707l4.147-4.147-4.147-4.146-.064-.078a.501.501 0 0 1 .693-.693l.078.064L12 11.293l4.146-4.147z" />
            </svg>
          </button>
        </div>

        <TabsContent value="color">
          <ColorPicker />
        </TabsContent>
        <TabsContent class="pb-3" value="gradient">
          <div v-if="isMounted && !isDesktop" class="sm:hidden border-b">
            <ColorPicker />
          </div>
          <div class="h-12 pl-4 pr-2 flex items-center justify-between gap-2">
            <ColorPickerSelect
              :model-value="GRADIENT_TYPE_LABELS[gradient.type.value]"
              class="w-24"
              label="Gradient type"
              placeholder="Type"
              :disabled="props.disabled"
              :options="gradientTypeOptions"
              @update:model-value="handleGradientTypeChange(gradient, commitValue, $event)"
            />
            <div class="flex items-center gap-1">
              <GradientPickerReverse />
              <GradientPickerRotate />
            </div>
          </div>

          <div class="pt-4 px-4">
            <GradientPickerSlider />
          </div>
          <div class="h-8 pl-4 pr-2 mt-2 mb-1 flex items-center justify-between">
            <span class="text-[11px] font-bold">Stops</span>
            <GradientPickerAddStop label="Add stop" />
          </div>
          <div
            v-for="(stop, index) in gradient.stops.value"
            :key="stop.id"
            :class="{ 'bg-vuelor-primary/10': gradient.selectedStopId.value === stop.id }"
            class="h-8 pl-4 pr-2 flex items-center gap-2"
            @mousedown="handleSelectStop(gradient, stop.id)"
            @focusin="handleSelectStop(gradient, stop.id)"
          >
            <GradientPickerPositionInput
              :stop-id="stop.id"
              :label="`Stop ${index + 1} position`"
            />
            <ColorPickerInputHex
              class="flex-1"
              :model-value="stop.color"
              @update:model-value="handleStopColorChange(gradient, commitValue, stop.id, $event)"
            >
              <template #before>
                <ColorPickerSwatch
                  :value="stop.color"
                  type="button"
                  data-stop-swatch
                  aria-haspopup="dialog"
                  :aria-expanded="isStopPopoverOpen && gradient.selectedStopId.value === stop.id"
                  :aria-label="`Edit stop ${index + 1} color`"
                  @pointerdown="handleStopSwatchPointerDown(gradient, stop.id)"
                  @click="handleStopSwatchClick(gradient, stop.id)"
                />
              </template>
            </ColorPickerInputHex>
            <GradientPickerRemoveStop
              :stop-id="stop.id"
              :label="`Remove stop ${index + 1}`"
              :style="{ visibility: gradient.stops.value.length <= gradient.minStops ? 'hidden' : undefined }"
              @pointerdown.prevent
            />
          </div>

          <!-- Shared stop-color popover: stays mounted while open; clicking another
               stop's swatch swaps the selection-bound picker content in place. -->
          <PopoverRoot v-model:open="isStopPopoverOpen">
            <PopoverPortal v-if="isDesktop">
              <PopoverContent
                :reference="panelRef"
                side="left"
                align="start"
                :sideOffset="STOP_POPOVER_SIDE_OFFSET"
                data-vuelor-docs
                class="bg-vuelor-surface w-60 z-50 rounded-lg shadow-vuelor-card"
                @interact-outside="handleStopPopoverInteractOutside"
              >
                <ColorPicker />
              </PopoverContent>
            </PopoverPortal>
          </PopoverRoot>
        </TabsContent>
      </TabsRoot>
    </ColorPickerRoot>
  </GradientPickerRoot>
</template>
