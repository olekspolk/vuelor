<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { createReusableTemplate, useMediaQuery, useMounted } from '@vueuse/core'
import { SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { ColorPickerInputHex, ColorPickerInputHSL, ColorPickerInputRGB, ColorPickerInputHSB } from '@vuelor/picker'
import { ColorPickerRoot, ColorPickerCanvas, ColorPickerEyeDropper, ColorPickerSwatch } from '@vuelor/picker'
import { ColorPickerSliderHue, ColorPickerSliderAlpha } from '@vuelor/picker'
import { HexaToRGBA, RGBAtoHexa, useVModel } from '@vuelor/picker'

import ColorPickerSelect from '../common/ColorPickerSelect.vue'
import GradientStopInput from '../common/GradientStopInput.vue'

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

interface GradientStop {
  id: number
  position: number
  color: string
}

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

function handleModeChange (value: string | number) {
  if (value !== 'color' && value !== 'gradient') return
  // Entering the color tab with no solid color yet: seed it from the selected
  // stop so the flip doesn't emit null (or the engine default) to the parent.
  if (value === 'color' && color.value === null) {
    color.value = selectedStop.value.color
  }
  mode.value = value
}

const GRADIENT_TYPES = ['Linear', 'Radial', 'Conic'] as const
type GradientType = (typeof GRADIENT_TYPES)[number]

const gradientType = ref<GradientType>('Linear')
const gradientTypeOptions = [...GRADIENT_TYPES]

function handleGradientTypeChange (value: string) {
  if ((GRADIENT_TYPES as readonly string[]).includes(value)) {
    gradientType.value = value as GradientType
  }
}

const gradientAngle = ref(90)

const MIN_GRADIENT_STOPS = 2
const MAX_GRADIENT_STOPS = 8

let stopId = 0
function createStop (position: number, color: string): GradientStop {
  return { id: stopId++, position, color }
}

// Stops live in one array of { id, position, color } kept sorted by position:
// colors can never detach from their positions, and the selection tracks an id
// so reordering never retargets it.
const gradientStops = ref<GradientStop[]>([
  createStop(0, '#FF98C2FF'),
  createStop(33, '#4DC1FFFF'),
  createStop(66, '#D082E8FF'),
  createStop(100, '#FFFA7AFF')
])

const gradientSelectedStopId = ref(gradientStops.value[0]!.id)

const selectedStop = computed<GradientStop>(() => {
  return gradientStops.value.find((stop) => stop.id === gradientSelectedStopId.value) ?? gradientStops.value[0]!
})

function sortStops () {
  gradientStops.value = [...gradientStops.value].sort((a, b) => a.position - b.position)
}

/** Expand #RGB / #RGBA / #RRGGBB to the canonical #RRGGBBAA form. */
function normalizeHexa (raw: string): string | null {
  let hex = raw.startsWith('#') ? raw.slice(1) : raw
  if (/^[0-9a-f]{3,4}$/i.test(hex)) hex = hex.split('').map((c) => c + c).join('')
  if (/^[0-9a-f]{6}$/i.test(hex)) hex += 'FF'
  return /^[0-9a-f]{8}$/i.test(hex) ? `#${hex.toUpperCase()}` : null
}

// Accepted stop grammar: comma-separated `#hex [position%]` segments, hex in
// 3/4/6/8-digit form, decimal positions rounded to integers, omitted positions
// interpolated like CSS. All-or-nothing: one bad segment rejects the whole
// list, so a partial parse can never silently drop stops.
function parseStops (stopsStr: string): GradientStop[] | null {
  const segments = stopsStr.split(',').map((segment) => segment.trim())
  if (segments.length < MIN_GRADIENT_STOPS) return null

  const parsed: { color: string, position: number | null }[] = []
  for (const segment of segments) {
    const match = segment.match(/^(#[0-9a-f]{3,8})(?:\s+(-?\d+(?:\.\d+)?)%)?$/i)
    if (!match) return null
    const color = normalizeHexa(match[1]!)
    if (!color) return null
    parsed.push({ color, position: match[2] === undefined ? null : parseFloat(match[2]!) })
  }

  // CSS defaulting rules: first stop at 0%, last at 100%, gaps spread evenly,
  // and a position never below the one before it.
  parsed[0]!.position ??= 0
  parsed[parsed.length - 1]!.position ??= 100
  for (let i = 1; i < parsed.length - 1; i++) {
    if (parsed[i]!.position !== null) continue
    let next = i
    while (parsed[next]!.position === null) next++
    const start = parsed[i - 1]!.position!
    const step = (parsed[next]!.position! - start) / (next - i + 1)
    for (let j = i; j < next; j++) parsed[j]!.position = start + step * (j - i + 1)
  }

  let previous = 0
  return parsed.map(({ color, position }) => {
    previous = Math.max(previous, Math.min(100, Math.max(0, Math.round(position!))))
    return createStop(previous, color)
  })
}

function normalizeAngle (raw: string): number {
  return ((Math.round(parseFloat(raw)) % 360) + 360) % 360
}

function applyStops (stops: GradientStop[]): void {
  gradientStops.value = stops
  gradientSelectedStopId.value = stops[0]!.id
  color.value ??= stops[0]!.color
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

  // linear-gradient(<angle>deg, <stops>)
  const linearMatch = input.match(/^linear-gradient\(\s*(-?\d+(?:\.\d+)?)deg\s*,\s*(.+)\)$/i)
  if (linearMatch) {
    const stops = parseStops(linearMatch[2]!)
    if (!stops) return warnUnsupported(value)
    mode.value = 'gradient'
    gradientType.value = 'Linear'
    gradientAngle.value = normalizeAngle(linearMatch[1]!)
    applyStops(stops)
    return
  }

  // radial-gradient(circle at center, <stops>)
  const radialMatch = input.match(/^radial-gradient\(\s*circle\s+at\s+center\s*,\s*(.+)\)$/i)
  if (radialMatch) {
    const stops = parseStops(radialMatch[1]!)
    if (!stops) return warnUnsupported(value)
    mode.value = 'gradient'
    gradientType.value = 'Radial'
    applyStops(stops)
    return
  }

  // conic-gradient(from <angle>deg, <stops>)
  const conicMatch = input.match(/^conic-gradient\(\s*from\s+(-?\d+(?:\.\d+)?)deg\s*,\s*(.+)\)$/i)
  if (conicMatch) {
    const stops = parseStops(conicMatch[2]!)
    if (!stops) return warnUnsupported(value)
    mode.value = 'gradient'
    gradientType.value = 'Conic'
    gradientAngle.value = normalizeAngle(conicMatch[1]!)
    applyStops(stops)
    return
  }

  warnUnsupported(value)
}

const externalModel = useVModel(props, emit, applyModelValue)

const currentColor = computed<ModelValue>({
  get: () => {
    return mode.value === 'color' ? color.value : selectedStop.value.color
  },
  set: (value) => {
    if (value === null) return
    if (mode.value === 'color') {
      color.value = value
    } else {
      // @vuelor/picker >= 1.0.2 round-trips alpha bit-exact, so a selection
      // echo equals the stored color and this assignment is a no-op.
      selectedStop.value.color = value
    }
  }
})

function handleSelectStop (id: number) {
  if (props.disabled) return
  gradientSelectedStopId.value = id
}

// Thumb events resolve the stop by index at event time: reka refocuses the
// thumb at the crossed index before Vue re-renders, so the render closure's
// `stop` can be one sort behind.
function handleSelectStopAt (index: number) {
  const stop = gradientStops.value[index]
  if (stop) handleSelectStop(stop.id)
}

// The stop currently being moved by pointer OR keyboard. reka's mid-move focus
// handoff (when a thumb crosses a neighbour) fires before it updates the model,
// so focus-driven selection reads pre-sort state and must be ignored while a
// move is live — this id keeps the actively-moved stop identified across the
// handoff. It also breaks position ties in handleSliderChange: when the moved
// stop sits exactly on top of another, the position diff alone can't tell which
// of the two moved.
//
// Set on pointerdown / arrow keydown (before reka reorders), cleared on
// pointerup / keyup. Deliberately NOT cleared on blur or value-commit: reka
// fires both DURING the crossing handoff (blur on the old thumb, valueCommit
// before the focus + model update), so clearing there would re-null the id
// mid-crossing and reintroduce the mis-selection.
let activeStopId: number | null = null

// reka's thumb-moving keys (arrows + page + home/end); other keys leave the
// stop unmoved so they must not mark it active.
const SLIDER_KEYS = new Set([
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'PageUp', 'PageDown', 'Home', 'End'
])

function handleThumbPointerDown (index: number) {
  handleSelectStopAt(index)
  activeStopId = gradientStops.value[index]?.id ?? null
}

function handleThumbKeyDown (index: number, event: KeyboardEvent) {
  if (!SLIDER_KEYS.has(event.key)) return
  // Runs in the thumb's target phase, before reka's slider keydown handler
  // reorders, so gradientStops[index] is still the thumb the user is arrowing.
  activeStopId = gradientStops.value[index]?.id ?? null
}

function handleThumbFocus (index: number) {
  // Only a genuine Tab focus (no move in progress) selects the focused stop;
  // during a crossing, reka's focus handoff must not change the selection.
  if (activeStopId === null) handleSelectStopAt(index)
}

function handleInteractionEnd () {
  activeStopId = null
}

function handleStopPositionChange (id: number, position: number) {
  const stop = gradientStops.value.find((s) => s.id === id)
  if (!stop) return
  stop.position = position
  // Typing a position past a neighbour re-sorts the pairs together, keeping
  // the sorted invariant the slider and serializer rely on.
  sortStops()
}

// The engine's hex/opacity fields own alpha preservation and only emit on a
// genuine change (@vuelor/picker >= 1.0.2), so the stop takes the value as-is.
function handleStopColorChange (id: number, value: string) {
  const stop = gradientStops.value.find((s) => s.id === id)
  if (stop) stop.color = value
}

function addStop () {
  if (props.disabled || gradientStops.value.length >= MAX_GRADIENT_STOPS) return

  // Split the segment to the right of the selected stop (to the left when the
  // selected stop is the last one) and make the new midpoint stop active.
  const stops = gradientStops.value
  const index = Math.max(0, Math.min(
    stops.findIndex((stop) => stop.id === gradientSelectedStopId.value),
    stops.length - 2
  ))
  const a = stops[index]!
  const b = stops[index + 1]!

  const colorA = HexaToRGBA(a.color)
  const colorB = HexaToRGBA(b.color)
  const stop = createStop(
    Math.round((a.position + b.position) / 2),
    RGBAtoHexa({
      r: (colorA.r + colorB.r) / 2,
      g: (colorA.g + colorB.g) / 2,
      b: (colorA.b + colorB.b) / 2,
      a: (colorA.a + colorB.a) / 2
    })
  )

  stops.splice(index + 1, 0, stop)
  gradientSelectedStopId.value = stop.id
}

function removeStop (id: number) {
  if (props.disabled || gradientStops.value.length <= MIN_GRADIENT_STOPS) return
  const index = gradientStops.value.findIndex((stop) => stop.id === id)
  if (index === -1) return
  gradientStops.value.splice(index, 1)
  if (gradientSelectedStopId.value === id) {
    gradientSelectedStopId.value = gradientStops.value[Math.max(0, index - 1)]!.id
  }
}

function handleReverseGradient () {
  if (props.disabled) return
  // Mirror positions as well as colors so unevenly spaced stops reverse
  // correctly; the reverse() keeps the array sorted ascending afterwards.
  gradientStops.value = gradientStops.value
    .map((stop) => ({ ...stop, position: 100 - stop.position }))
    .reverse()
}

function handleRotateGradient () {
  if (props.disabled) return
  gradientAngle.value = (gradientAngle.value + 90) % 360
}

const sliderPositions = computed(() => gradientStops.value.map((stop) => stop.position))

// reka-ui re-sorts the value array whenever a thumb crosses another, so the
// emitted array can't be applied by index. Diff it against the current
// positions to find the moved value and give it to the right stop.
function handleSliderChange (positions: number[] | undefined) {
  if (!positions || props.disabled || positions.length !== gradientStops.value.length) return

  const delta = new Map<number, number>()
  for (const position of positions) delta.set(position, (delta.get(position) ?? 0) + 1)
  for (const position of sliderPositions.value) delta.set(position, (delta.get(position) ?? 0) - 1)

  let from: number | undefined
  let to: number | undefined
  for (const [position, count] of delta) {
    if (count < 0) from = position
    if (count > 0) to = position
  }
  if (from === undefined || to === undefined) return

  const candidates = gradientStops.value.filter((stop) => stop.position === from)
  const moved = candidates.find((stop) => stop.id === activeStopId) ??
    candidates.find((stop) => stop.id === gradientSelectedStopId.value) ??
    candidates[0]
  if (!moved) return
  moved.position = to
  // Moving a thumb (pointer or keyboard) selects its stop. This must happen here
  // rather than in a thumb focus handler: reka focuses the crossed thumb before
  // it updates the model, so focus-driven selection would read pre-sort state.
  gradientSelectedStopId.value = moved.id
  sortStops()
}

const gradientStopsList = computed(() => {
  return gradientStops.value.map((stop) => `${stop.color} ${stop.position}%`).join(', ')
})

const trackBackground = computed(() => {
  return `linear-gradient(to right, ${gradientStopsList.value})`
})

const modelValue = computed<ModelValue>(() => {
  if (mode.value === 'color') {
    return color.value
  }

  switch (gradientType.value) {
    case 'Radial':
      return `radial-gradient(circle at center, ${gradientStopsList.value})`
    case 'Conic':
      return `conic-gradient(from ${gradientAngle.value}deg, ${gradientStopsList.value})`
    default:
      return `linear-gradient(${gradientAngle.value}deg, ${gradientStopsList.value})`
  }
})

// No immediate flush: emitting during setup would overwrite the parent's value
// with our defaults before it was parsed. The null guard keeps an untouched
// color tab from nulling a bound model.
watch(modelValue, (newValue) => {
  if (newValue !== null) externalModel.value = newValue
})

// Position the stop popover to the left of the 240px-wide picker panel (w-60)
// so it doesn't cover the stop list.
const STOP_POPOVER_SIDE_OFFSET = 75
const STOP_POPOVER_ALIGN_OFFSET = -100

const THUMB_CLASS = 'flex items-center justify-center w-6 h-6 -mt-8 drop-shadow-vuelor-thumb rounded-[5px] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-vuelor-primary relative after:content-[\'\'] after:absolute after:top-[100%] after:left-1/2 after:-translate-x-1/2 after:border-l-[6px] after:border-l-transparent after:border-r-[6px] after:border-r-transparent after:border-t-[6px]'
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
      @update:model-value="handleModeChange"
    >
      <div class="flex justify-between p-2 border-b">
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
            :model-value="gradientType"
            class="w-24"
            label="Gradient type"
            placeholder="Type"
            :disabled="props.disabled"
            :options="gradientTypeOptions"
            @update:model-value="handleGradientTypeChange"
          />
          <div class="flex items-center gap-1">
            <button
              type="button"
              aria-label="Reverse gradient"
              :disabled="props.disabled"
              class="rounded-[5px] enabled:hover:bg-vuelor-input disabled:opacity-50 focus:outline focus:outline-vuelor-primary"
              @click="handleReverseGradient"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" d="M8.354 6.354a.5.5 0 1 0-.708-.708l-2.5 2.5a.5.5 0 0 0 0 .708l2.5 2.5a.5.5 0 0 0 .708-.708L6.707 9H18.5a.5.5 0 0 0 0-1H6.707zm7.292 7a.5.5 0 0 1 .708-.708l2.5 2.5a.5.5 0 0 1 0 .708l-2.5 2.5a.5.5 0 0 1-.708-.708L17.293 16H5.5a.5.5 0 0 1 0-1h11.793z" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Rotate gradient 90 degrees"
              :disabled="props.disabled || gradientType === 'Radial'"
              class="rounded-[5px] enabled:hover:bg-vuelor-input disabled:opacity-50 focus:outline focus:outline-vuelor-primary"
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
            :model-value="sliderPositions"
            :disabled="props.disabled"
            class="relative flex items-center select-none touch-none"
            thumb-alignment="overflow"
            @update:model-value="handleSliderChange"
          >
            <SliderTrack
              :style="{ background: trackBackground }"
              class="relative grow rounded-[5px] h-8 shadow-vuelor-inner"
            />
            <!-- Thumbs are keyed by index on purpose: reka pairs each thumb with
                 modelValue[registration order], so thumb elements must never
                 reorder. Stop identity lives in the stops array instead. -->
            <SliderThumb
              v-for="(stop, i) in gradientStops"
              :key="i"
              :aria-label="`Gradient stop ${i + 1} of ${gradientStops.length}`"
              :class="[THUMB_CLASS, gradientSelectedStopId === stop.id ? 'bg-vuelor-primary after:border-t-vuelor-primary' : 'bg-vuelor-surface after:border-t-vuelor-surface']"
              @pointerdown="handleThumbPointerDown(i)"
              @pointerup="handleInteractionEnd"
              @keydown="handleThumbKeyDown(i, $event)"
              @keyup="handleInteractionEnd"
              @focus="handleThumbFocus(i)"
            >
              <ColorPickerSwatch
                as="span"
                class="w-3.5 h-3.5 border border-vuelor-border rounded-sm"
                :value="stop.color"
              />
            </SliderThumb>
          </SliderRoot>
        </div>
        <div class="h-8 pl-4 pr-2 mt-2 mb-1 flex items-center justify-between">
          <span class="text-[11px] font-bold">Stops</span>
          <button
            type="button"
            aria-label="Add stop"
            :disabled="props.disabled || gradientStops.length >= MAX_GRADIENT_STOPS"
            class="rounded-[5px] enabled:hover:bg-vuelor-input disabled:opacity-50 focus:outline focus:outline-vuelor-primary"
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
          v-for="(stop, index) in gradientStops"
          :key="stop.id"
          :class="{ 'bg-vuelor-primary/10': gradientSelectedStopId === stop.id }"
          class="h-8 pl-4 pr-2 flex items-center gap-2"
          @mousedown="handleSelectStop(stop.id)"
          @focusin="handleSelectStop(stop.id)"
        >
          <GradientStopInput
            :model-value="stop.position"
            :label="`Stop ${index + 1} position`"
            @update:model-value="handleStopPositionChange(stop.id, $event)"
          />
          <ColorPickerInputHex
            class="flex-1"
            :model-value="stop.color"
            @update:model-value="handleStopColorChange(stop.id, $event)"
          >
            <template #before>
              <PopoverRoot>
                <PopoverTrigger as-child>
                  <ColorPickerSwatch
                    :value="stop.color"
                    type="button"
                    :aria-label="`Edit stop ${index + 1} color`"
                  />
                </PopoverTrigger>
                <PopoverPortal v-if="isDesktop">
                  <PopoverContent
                    side="left"
                    align="start"
                    :alignOffset="STOP_POPOVER_ALIGN_OFFSET"
                    :sideOffset="STOP_POPOVER_SIDE_OFFSET"
                    data-vuelor-docs
                    class="bg-vuelor-surface w-60 z-10 rounded-lg shadow-vuelor-card"
                  >
                    <ColorPicker />
                  </PopoverContent>
                </PopoverPortal>
              </PopoverRoot>
            </template>
          </ColorPickerInputHex>
          <button
            type="button"
            :aria-label="`Remove stop ${index + 1}`"
            :disabled="props.disabled"
            class="rounded-[5px] enabled:hover:bg-vuelor-input disabled:opacity-50 focus:outline focus:outline-vuelor-primary"
            :style="{ visibility: gradientStops.length <= MIN_GRADIENT_STOPS ? 'hidden' : undefined }"
            @click="removeStop(stop.id)"
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
