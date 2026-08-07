<script lang="ts">
export interface GradientPickerSliderProps {
  class?: string,
  ui?: Partial<{
    root: string
    track: string
    thumb: string
    thumbSwatch: string
  }>
}
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted } from 'vue'
import { SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { HexaToRGBA, RGBAtoCSS, SVG_MOSAIC_URL } from '@vuelor/picker'
import { diffPositions } from '../core/stops.ts'
import { injectGradientPickerContext } from './GradientPickerRoot.vue'

const props = defineProps<GradientPickerSliderProps>()

const rootContext = injectGradientPickerContext()

const positions = computed(() => rootContext.stops.value.map((stop) => stop.position))

// The stop currently being moved by pointer OR keyboard. reka's mid-move focus
// handoff (when a thumb crosses a neighbour) fires before it updates the
// model, so focus-driven selection reads pre-sort state and must be ignored
// while a move is live — this id keeps the actively-moved stop identified
// across the handoff. It also breaks position ties in handleSliderChange:
// when the moved stop sits exactly on top of another, the position diff alone
// can't tell which of the two moved.
//
// Set on pointerdown / arrow keydown (before reka reorders), cleared on
// pointerup / pointercancel / keyup (plus window keyup and blur, for releases
// that land outside the thumbs). Deliberately NOT cleared on thumb blur or
// value-commit: reka fires both DURING the crossing handoff (blur on the old
// thumb, valueCommit before the focus + model update), so clearing there
// would re-null the id mid-crossing and reintroduce the mis-selection.
let activeStopId: number | null = null

// reka's thumb-moving keys (arrows + page + home/end); other keys leave the
// stop unmoved so they must not mark it active.
const SLIDER_KEYS = new Set([
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'PageUp', 'PageDown', 'Home', 'End'
])

// Thumb events resolve the stop by index at event time: reka refocuses the
// thumb at the crossed index before Vue re-renders, so the render closure's
// `stop` can be one sort behind.
function handleThumbPointerDown (index: number) {
  if (rootContext.disabled.value) return
  rootContext.selectAt(index)
  activeStopId = rootContext.stops.value[index]?.id ?? null
}

function handleThumbKeyDown (index: number, event: KeyboardEvent) {
  if (!SLIDER_KEYS.has(event.key)) return
  // Runs in the thumb's target phase, before reka's slider keydown handler
  // reorders, so stops[index] is still the thumb the user is arrowing.
  activeStopId = rootContext.stops.value[index]?.id ?? null
}

function handleThumbFocus (index: number) {
  // Only a genuine Tab focus (no move in progress) selects the focused stop;
  // during a crossing, reka's focus handoff must not change the selection.
  if (activeStopId === null && !rootContext.disabled.value) rootContext.selectAt(index)
}

function handleInteractionEnd () {
  activeStopId = null
}

// A keyup can land outside the thumbs (focus moved mid-press) and a window
// blur can swallow it entirely (alt-tab mid-press); both end any keyboard
// move, so they must clear the active id — thumb-level keyup alone leaks it.
onMounted(() => {
  window.addEventListener('keyup', handleInteractionEnd)
  window.addEventListener('blur', handleInteractionEnd)
})

onBeforeUnmount(() => {
  window.removeEventListener('keyup', handleInteractionEnd)
  window.removeEventListener('blur', handleInteractionEnd)
})

function handleSliderChange (value: number[] | undefined) {
  if (!value || rootContext.disabled.value || value.length !== rootContext.stops.value.length) return

  const diff = diffPositions(positions.value, value)
  if (!diff) return

  const candidates = rootContext.stops.value.filter((stop) => stop.position === diff.from)
  const moved = candidates.find((stop) => stop.id === activeStopId) ??
    candidates.find((stop) => stop.id === rootContext.selectedStopId.value) ??
    candidates[0]
  if (!moved) return

  // Moving a thumb (pointer or keyboard) selects its stop. This must happen
  // here rather than in a thumb focus handler: reka focuses the crossed thumb
  // before it updates the model, so focus-driven selection would read
  // pre-sort state.
  rootContext.moveStop(moved.id, diff.to)
  rootContext.select(moved.id)
}

function handleValueCommit () {
  // reka's keyboard path emits valueCommit BEFORE it applies that step's
  // model update (pointer commits arrive after the last update), so defer
  // one tick and serialize the post-step state.
  nextTick(() => rootContext.commitValue())
}

function thumbSwatchStyle (color: string) {
  const rgba = RGBAtoCSS(HexaToRGBA(color))
  // The stop color layered over a checkerboard, so translucent stops read as
  // translucent.
  return { backgroundImage: `linear-gradient(${rgba}, ${rgba}), url(${SVG_MOSAIC_URL})` }
}

const ui = rootContext.uiSlots('slider')
</script>

<template>
  <SliderRoot
    :model-value="positions"
    :disabled="rootContext.disabled.value"
    :min="0"
    :max="100"
    :step="1"
    thumb-alignment="overflow"
    :class="ui.root(props.ui?.root, props.class)"
    @update:model-value="handleSliderChange"
    @value-commit="handleValueCommit"
  >
    <SliderTrack
      :style="{ background: rootContext.trackCSS.value }"
      :class="ui.track(props.ui?.track)"
    />
    <!-- Thumbs are keyed by index on purpose: reka pairs each thumb with
         modelValue[registration order], so thumb elements must never reorder.
         Stop identity lives in the stops array instead. -->
    <SliderThumb
      v-for="(stop, i) in rootContext.stops.value"
      :key="i"
      :aria-label="`Gradient stop ${i + 1} of ${rootContext.stops.value.length}`"
      :data-selected="rootContext.selectedStopId.value === stop.id ? '' : undefined"
      :class="ui.thumb(props.ui?.thumb)"
      @pointerdown="handleThumbPointerDown(i)"
      @pointerup="handleInteractionEnd"
      @pointercancel="handleInteractionEnd"
      @keydown="handleThumbKeyDown(i, $event)"
      @keyup="handleInteractionEnd"
      @focus="handleThumbFocus(i)"
    >
      <slot
        name="thumb"
        :stop="stop"
        :index="i"
        :selected="rootContext.selectedStopId.value === stop.id"
      >
        <span
          :style="thumbSwatchStyle(stop.color)"
          :class="ui.thumbSwatch(props.ui?.thumbSwatch)"
        />
      </slot>
    </SliderThumb>
  </SliderRoot>
</template>
