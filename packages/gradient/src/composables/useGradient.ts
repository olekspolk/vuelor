import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { GradientStop, GradientType } from '../core/types.ts'
import { MIN_GRADIENT_STOPS, normalizeAngle, normalizeHexa, parseGradient } from '../core/parse.ts'
import { serializeGradient, serializeGradientStops, stopsToTrackCSS } from '../core/serialize.ts'
import { clampPosition, colorAt, midpointStop, reverseStops } from '../core/stops.ts'

/** A gradient stop with the stable identity the editor tracks selection by. */
export type ManagedGradientStop = GradientStop & { id: number }

export interface UseGradientOptions {
  type?: GradientType,
  angle?: number,
  stops?: GradientStop[],
  /**
   * Interaction floor for removeStop; never below 2, the CSS gradient
   * minimum. setFromCSS treats a parsed model as authoritative and keeps
   * however many stops it declares.
   */
  minStops?: number,
  /** Interaction ceiling for addStop; setFromCSS may load more. */
  maxStops?: number
}

export const DEFAULT_MAX_STOPS = 8

const DEFAULT_STOPS: GradientStop[] = [
  { color: '#FF98C2FF', position: 0 },
  { color: '#FFFA7AFF', position: 100 }
]

function warnInvalidColor (source: string, color: string): void {
  // process.env.NODE_ENV survives the library build, so the warning reaches
  // consumers' dev builds and is stripped from their production bundles.
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[useGradient] ${source} ignored invalid color "${color}". Expected 3/4/6/8-digit hex, e.g. "#FF0000FF".`)
  }
}

export function useGradient (options: UseGradientOptions = {}) {
  const minStops = Math.max(MIN_GRADIENT_STOPS, options.minStops ?? MIN_GRADIENT_STOPS)
  const maxStops = Math.max(minStops, options.maxStops ?? DEFAULT_MAX_STOPS)

  // Ids only need to be unique within this editor instance; they exist so
  // selection survives the re-sorts that position changes cause.
  let nextStopId = 0
  function createStop (position: number, color: string): ManagedGradientStop {
    return {
      id: nextStopId++,
      position: clampPosition(position),
      color: normalizeHexa(color) ?? '#000000FF'
    }
  }

  function toSorted (list: ManagedGradientStop[]): ManagedGradientStop[] {
    return [...list].sort((a, b) => a.position - b.position)
  }

  // All-or-nothing like the parser: partially valid initial stops would
  // otherwise be silently patched with black placeholders.
  const providedStops = options.stops ?? []
  const providedStopsValid = providedStops.length >= MIN_GRADIENT_STOPS &&
    providedStops.every((stop) => normalizeHexa(stop.color) !== null)
  if (providedStops.length > 0 && !providedStopsValid && process.env.NODE_ENV !== 'production') {
    console.warn('[useGradient] Invalid initial stops (need >= 2 stops with hex colors); falling back to the default gradient.')
  }
  const initialStops = providedStopsValid ? providedStops : DEFAULT_STOPS

  // Stops live in one array of { id, position, color } kept sorted by
  // position: colors can never detach from their positions, and the selection
  // tracks an id so reordering never retargets it.
  const stops: Ref<ManagedGradientStop[]> = ref(
    toSorted(initialStops.map((stop) => createStop(stop.position, stop.color)))
  )
  const type: Ref<GradientType> = ref(options.type ?? 'linear')
  const angle = ref(normalizeAngle(options.angle ?? 90))
  const selectedStopId = ref(stops.value[0]!.id)

  const selectedStop = computed<ManagedGradientStop>(() =>
    stops.value.find((stop) => stop.id === selectedStopId.value) ?? stops.value[0]!
  )

  // Bridge for a color picker editing the selected stop, e.g.
  // <ColorPickerRoot v-model="gradient.selectedColor.value">.
  const selectedColor = computed<string>({
    get: () => selectedStop.value.color,
    set: (value) => setStopColor(selectedStop.value.id, value)
  })

  const stopsCSS = computed(() => serializeGradientStops(stops.value))
  const css = computed(() => serializeGradient({
    type: type.value,
    angle: angle.value,
    stops: stops.value
  }))
  const trackCSS = computed(() => stopsToTrackCSS(stops.value))

  const canAddStop = computed(() => stops.value.length < maxStops)
  const canRemoveStop = computed(() => stops.value.length > minStops)

  function select (id: number): void {
    if (stops.value.some((stop) => stop.id === id)) selectedStopId.value = id
  }

  function selectAt (index: number): void {
    const stop = stops.value[index]
    if (stop) selectedStopId.value = stop.id
  }

  function moveStop (id: number, position: number): void {
    const stop = stops.value.find((s) => s.id === id)
    if (!stop) return
    stop.position = clampPosition(position)
    stops.value = toSorted(stops.value)
  }

  function setStopColor (id: number, color: string): void {
    const hexa = normalizeHexa(color)
    if (!hexa) return warnInvalidColor('setStopColor', color)
    const stop = stops.value.find((s) => s.id === id)
    if (stop) stop.color = hexa
  }

  function addStop (position?: number, color?: string): ManagedGradientStop | null {
    if (!canAddStop.value) return null
    // Consistent with setStopColor: an invalid color rejects the mutation
    // instead of silently inserting an opaque-black stop.
    if (color !== undefined && normalizeHexa(color) === null) {
      warnInvalidColor('addStop', color)
      return null
    }

    const list = stops.value
    let stop: ManagedGradientStop
    if (position === undefined) {
      // Split the segment to the right of the selected stop (to the left when
      // the selected stop is the last one) at its color/position midpoint.
      const index = Math.max(0, Math.min(
        list.findIndex((s) => s.id === selectedStopId.value),
        list.length - 2
      ))
      const midpoint = midpointStop(list[index]!, list[index + 1]!)
      stop = createStop(midpoint.position, color ?? midpoint.color)
      // Insert beside the split segment: the stable sort then keeps the new
      // stop next to its neighbours even when positions collide.
      list.splice(index + 1, 0, stop)
    } else {
      const target = clampPosition(position)
      stop = createStop(target, color ?? colorAt(list, target))
      list.push(stop)
    }

    stops.value = toSorted(list)
    selectedStopId.value = stop.id
    return stop
  }

  function removeStop (id: number = selectedStopId.value): boolean {
    if (!canRemoveStop.value) return false
    const index = stops.value.findIndex((stop) => stop.id === id)
    if (index === -1) return false
    stops.value.splice(index, 1)
    if (selectedStopId.value === id) {
      selectedStopId.value = stops.value[Math.max(0, index - 1)]!.id
    }
    return true
  }

  function reverse (): void {
    stops.value = reverseStops(stops.value)
  }

  function rotate (degrees = 90): void {
    angle.value = normalizeAngle(angle.value + degrees)
  }

  /**
   * Parse a CSS gradient and replace the whole editor state. The parsed
   * model is authoritative: its stop count is not clamped to minStops /
   * maxStops, which only bound the addStop / removeStop interactions.
   */
  function setFromCSS (input: string): boolean {
    const parsed = parseGradient(input)
    if (!parsed) return false
    type.value = parsed.type
    if (parsed.angle !== undefined) angle.value = parsed.angle
    stops.value = parsed.stops.map((stop) => createStop(stop.position, stop.color))
    selectedStopId.value = stops.value[0]!.id
    return true
  }

  return {
    minStops,
    maxStops,
    type,
    angle,
    stops,
    selectedStopId,
    selectedStop,
    selectedColor,
    css,
    stopsCSS,
    trackCSS,
    canAddStop,
    canRemoveStop,
    select,
    selectAt,
    addStop,
    removeStop,
    moveStop,
    setStopColor,
    reverse,
    rotate,
    setFromCSS
  }
}

export type UseGradientReturn = ReturnType<typeof useGradient>
