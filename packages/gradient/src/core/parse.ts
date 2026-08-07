import type { GradientStop, ParsedGradient } from './types.ts'

/** A CSS gradient needs at least two stops to be renderable. */
export const MIN_GRADIENT_STOPS = 2

/** Expand #RGB / #RGBA / #RRGGBB to the canonical #RRGGBBAA form. */
export function normalizeHexa (raw: string): string | null {
  let hex = raw.startsWith('#') ? raw.slice(1) : raw
  if (/^[0-9a-f]{3,4}$/i.test(hex)) hex = hex.split('').map((c) => c + c).join('')
  if (/^[0-9a-f]{6}$/i.test(hex)) hex += 'FF'
  return /^[0-9a-f]{8}$/i.test(hex) ? `#${hex.toUpperCase()}` : null
}

/** Wrap any angle into the 0–359 range, rounded to whole degrees. */
export function normalizeAngle (raw: number | string): number {
  const angle = typeof raw === 'string' ? parseFloat(raw) : raw
  if (!Number.isFinite(angle)) return 0
  return ((Math.round(angle) % 360) + 360) % 360
}

// Split on separators outside parentheses, so color functions with nested
// commas (rgb(), hsl(), var()) stay one segment when the grammar grows to
// accept them.
export function splitTopLevel (input: string, separator = ','): string[] {
  const segments: string[] = []
  let depth = 0
  let current = ''
  for (const char of input) {
    if (char === '(') depth++
    else if (char === ')') depth = Math.max(0, depth - 1)
    if (char === separator && depth === 0) {
      segments.push(current)
      current = ''
    } else {
      current += char
    }
  }
  segments.push(current)
  return segments
}

// Accepted stop grammar: comma-separated `#hex [position%]` segments, hex in
// 3/4/6/8-digit form, decimal positions rounded to integers, omitted positions
// interpolated like CSS. All-or-nothing: one bad segment rejects the whole
// list, so a partial parse can never silently drop stops.
export function parseGradientStops (input: string): GradientStop[] | null {
  const segments = splitTopLevel(input).map((segment) => segment.trim())
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
    return { color, position: previous }
  })
}

const LINEAR_RE = /^linear-gradient\(\s*(-?\d+(?:\.\d+)?)deg\s*,\s*(.+)\)$/i
const RADIAL_RE = /^radial-gradient\(\s*circle\s+at\s+center\s*,\s*(.+)\)$/i
const CONIC_RE = /^conic-gradient\(\s*from\s+(-?\d+(?:\.\d+)?)deg\s*,\s*(.+)\)$/i

// Supported grammar — exactly what serializeGradient emits, so values
// round-trip:
//   linear-gradient(<angle>deg, <stops>)
//   radial-gradient(circle at center, <stops>)
//   conic-gradient(from <angle>deg, <stops>)
export function parseGradient (input: string): ParsedGradient | null {
  const value = input.trim()

  const linear = value.match(LINEAR_RE)
  if (linear) {
    const stops = parseGradientStops(linear[2]!)
    return stops && { type: 'linear', angle: normalizeAngle(linear[1]!), stops }
  }

  const radial = value.match(RADIAL_RE)
  if (radial) {
    const stops = parseGradientStops(radial[1]!)
    return stops && { type: 'radial', stops }
  }

  const conic = value.match(CONIC_RE)
  if (conic) {
    const stops = parseGradientStops(conic[2]!)
    return stops && { type: 'conic', angle: normalizeAngle(conic[1]!), stops }
  }

  return null
}

// Loose shape check for dispatching a model that can hold either a plain
// color or a gradient; parseGradient stays the authority on validity.
export function isGradient (input: string): boolean {
  return /^(?:linear|radial|conic)-gradient\(/i.test(input.trim())
}
