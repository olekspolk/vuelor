import { HexaToRGBA, RGBAtoHexa } from '@vuelor/picker'
import type { GradientStop } from './types.ts'

/** Clamp to the 0–100 integer range gradient positions live in. */
export function clampPosition (position: number): number {
  if (!Number.isFinite(position)) return 0
  return Math.min(100, Math.max(0, Math.round(position)))
}

/** Linear RGBA mix of two #RRGGBBAA colors; t=0 gives a, t=1 gives b. */
export function mixHexa (a: string, b: string, t = 0.5): string {
  const from = HexaToRGBA(a)
  const to = HexaToRGBA(b)
  return RGBAtoHexa({
    r: from.r + (to.r - from.r) * t,
    g: from.g + (to.g - from.g) * t,
    b: from.b + (to.b - from.b) * t,
    a: from.a + (to.a - from.a) * t
  })
}

/** The stop halfway between two stops, in both position and color. */
export function midpointStop (a: GradientStop, b: GradientStop): GradientStop {
  return {
    position: clampPosition((a.position + b.position) / 2),
    color: mixHexa(a.color, b.color)
  }
}

/** Piecewise-linear color of a sorted stop list at an arbitrary position. */
export function colorAt (stops: readonly GradientStop[], position: number): string {
  if (stops.length === 0) return '#000000FF'
  const target = clampPosition(position)
  const first = stops[0]!
  if (target <= first.position) return first.color
  const last = stops[stops.length - 1]!
  if (target >= last.position) return last.color
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i]!
    const b = stops[i + 1]!
    if (target > b.position) continue
    const span = b.position - a.position
    return span === 0 ? b.color : mixHexa(a.color, b.color, (target - a.position) / span)
  }
  return last.color
}

// Mirror positions as well as colors so unevenly spaced stops reverse
// correctly; the reverse() keeps the list sorted ascending afterwards. Extra
// properties (like editor ids) survive via the spread.
export function reverseStops<T extends GradientStop> (stops: readonly T[]): T[] {
  return stops.map((stop) => ({ ...stop, position: 100 - stop.position })).reverse()
}

// reka-ui re-sorts a multi-thumb value array whenever a thumb crosses another,
// so an emitted array can't be applied by index. Diff it against the previous
// positions to find the single moved value.
export function diffPositions (previous: readonly number[], next: readonly number[]): { from: number, to: number } | null {
  const delta = new Map<number, number>()
  for (const position of next) delta.set(position, (delta.get(position) ?? 0) + 1)
  for (const position of previous) delta.set(position, (delta.get(position) ?? 0) - 1)

  let from: number | undefined
  let to: number | undefined
  for (const [position, count] of delta) {
    if (count < 0) from = position
    if (count > 0) to = position
  }
  if (from === undefined || to === undefined) return null
  return { from, to }
}
