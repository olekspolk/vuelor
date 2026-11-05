import { HSLtoHSV, HSVtoRGB, parseHex, RGBAtoHexa, toHex } from '@vuelor/picker'
import type { GradientStop, GradientType, ParsedGradient } from './types.ts'

/** A CSS gradient needs at least two stops to be renderable. */
export const MIN_GRADIENT_STOPS = 2

// Expand #RGB / #RGBA / #RRGGBB to the canonical #RRGGBBAA form. Delegates
// to the picker's parseHex so both packages agree on what "valid hex" means
// (including its whitespace tolerance) and can never drift.
export function normalizeHexa (raw: string): string | null {
  const rgba = parseHex(raw)
  return rgba ? RGBAtoHexa(rgba) : null
}

/** Wrap any angle into the 0–359 range, rounded to whole degrees. */
export function normalizeAngle (raw: number | string): number {
  const angle = typeof raw === 'string' ? parseFloat(raw) : raw
  if (!Number.isFinite(angle)) return 0
  return ((Math.round(angle) % 360) + 360) % 360
}

// Split on separators outside parentheses, so color functions with nested
// commas (rgb(), hsl()) stay one segment.
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

// A CSS <number>: optional sign, then digits with an optional fraction or a
// bare fraction (.5). Exponents are not accepted.
const NUMBER = '[+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)'
const NUMERIC_RE = new RegExp(`^(${NUMBER})(%?)$`)
const ANGLE_RE = new RegExp(`^(${NUMBER})(deg|grad|rad|turn)$`, 'i')

const DEGREES_PER_UNIT: Record<string, number> = {
  deg: 1,
  grad: 360 / 400,
  rad: 180 / Math.PI,
  turn: 360
}

// An <angle> with its unit, in degrees (not yet wrapped), or null.
function parseAngle (raw: string): number | null {
  const match = raw.match(ANGLE_RE)
  return match ? parseFloat(match[1]!) * DEGREES_PER_UNIT[match[2]!.toLowerCase()]! : null
}

function parseNumeric (raw: string): { value: number, percent: boolean } | null {
  const match = raw.match(NUMERIC_RE)
  return match ? { value: parseFloat(match[1]!), percent: match[2] === '%' } : null
}

// Scale a <number> (0–numberMax) or <percentage> (0–100%) token to a clamped
// 0–255 byte. Math.round sends halves up, the way browsers serialize alpha:
// rgba(…, 0.3) is 76.5 → 77 (4D), not the 76 (4C) banker's rounding gives.
function parseByte (raw: string, numberMax: number): number | null {
  const numeric = parseNumeric(raw)
  if (!numeric) return null
  const max = numeric.percent ? 100 : numberMax
  return Math.round(Math.min(max, Math.max(0, numeric.value)) * 255 / max)
}

// Saturation and lightness as a 0–1 fraction. Legacy CSS requires the %, the
// space syntax allows a bare number on the same 0–100 scale; both parse.
function parseFraction (raw: string): number | null {
  const numeric = parseNumeric(raw)
  return numeric && Math.min(100, Math.max(0, numeric.value)) / 100
}

// A bare hue number is in degrees.
function parseHue (raw: string): number | null {
  const numeric = parseNumeric(raw)
  if (numeric) return numeric.percent ? null : numeric.value
  return parseAngle(raw)
}

const COLOR_FUNCTION_RE = /^(rgba?|hsla?)\(([^()]*)\)$/i
// The space syntax: three channels, then an optional `/ alpha`.
const SPACE_ARGS_RE = /^([^\s/]+)\s+([^\s/]+)\s+([^\s/]+)\s*(?:\/\s*([^\s/]+))?$/

// rgb()/rgba() and hsl()/hsla() are aliases since CSS Color 4: either name
// takes three channels or three plus alpha, in the comma or the space syntax.
function parseColorFunction (name: string, body: string): string | null {
  const args = body.includes(',')
    ? body.split(',').map((arg) => arg.trim())
    : body.trim().match(SPACE_ARGS_RE)?.slice(1).filter((arg) => arg !== undefined)
  if (!args || args.length < 3 || args.length > 4) return null
  const [first, second, third, alphaArg = '1'] = args as [string, string, string, string?]

  const alpha = parseByte(alphaArg, 1)
  let channels: (number | null)[]
  if (name.startsWith('rgb')) {
    channels = [parseByte(first, 255), parseByte(second, 255), parseByte(third, 255)]
  } else {
    const hue = parseHue(first)
    const saturation = parseFraction(second)
    const lightness = parseFraction(third)
    if (hue === null || saturation === null || lightness === null) return null
    const { r, g, b } = HSVtoRGB(HSLtoHSV({ h: ((hue % 360) + 360) % 360, s: saturation, l: lightness }))
    channels = [r, g, b]
  }

  const bytes = [...channels, alpha]
  if (bytes.some((byte) => byte === null)) return null
  return `#${bytes.map((byte) => toHex(byte!)).join('')}`
}

// The CSS basic color keywords, plus transparent.
const NAMED_COLORS = new Map([
  ['transparent', '#00000000'],
  ['black', '#000000FF'],
  ['silver', '#C0C0C0FF'],
  ['gray', '#808080FF'],
  ['white', '#FFFFFFFF'],
  ['maroon', '#800000FF'],
  ['red', '#FF0000FF'],
  ['purple', '#800080FF'],
  ['fuchsia', '#FF00FFFF'],
  ['green', '#008000FF'],
  ['lime', '#00FF00FF'],
  ['olive', '#808000FF'],
  ['yellow', '#FFFF00FF'],
  ['navy', '#000080FF'],
  ['blue', '#0000FFFF'],
  ['teal', '#008080FF'],
  ['aqua', '#00FFFFFF']
])

/**
 * Canonicalize a CSS color to `#RRGGBBAA`, or null when it is not one of the
 * accepted forms: `#hex` (3/4/6/8 digits), `rgb()`/`rgba()` and
 * `hsl()`/`hsla()` in the comma or the space syntax (with an optional
 * `/ alpha`), `transparent` and the 16 basic named colors. Unlike
 * normalizeHexa, hex needs its leading `#`, as in CSS.
 */
export function normalizeColor (raw: string): string | null {
  const value = raw.trim()
  if (value.startsWith('#')) return /^#[0-9a-f]+$/i.test(value) ? normalizeHexa(value) : null
  const named = NAMED_COLORS.get(value.toLowerCase())
  if (named) return named
  const fn = value.match(COLOR_FUNCTION_RE)
  return fn ? parseColorFunction(fn[1]!.toLowerCase(), fn[2]!) : null
}

const STOP_RE = new RegExp(`^([\\s\\S]+?)(?:\\s+(${NUMBER})%)?$`)

// One `<color> [<position>%]` segment; the position is null when omitted.
// Any other trailing token (a px length, a second position) lands in the
// color part and fails there.
function parseStop (segment: string): { color: string, position: number | null } | null {
  const match = segment.trim().match(STOP_RE)
  const color = match && normalizeColor(match[1]!)
  if (!color) return null
  return { color, position: match![2] === undefined ? null : parseFloat(match![2]!) }
}

function parseStopSegments (segments: string[]): GradientStop[] | null {
  if (segments.length < MIN_GRADIENT_STOPS) return null

  const parsed: { color: string, position: number | null }[] = []
  for (const segment of segments) {
    const stop = parseStop(segment)
    if (!stop) return null
    parsed.push(stop)
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

// Accepted stop grammar: comma-separated `<color> [<position>%]` segments,
// colors in any form normalizeColor accepts, decimal positions rounded to
// integers, omitted positions interpolated like CSS. All-or-nothing: one bad
// segment rejects the whole list, so a partial parse can never silently drop
// stops.
export function parseGradientStops (input: string): GradientStop[] | null {
  return parseStopSegments(splitTopLevel(input))
}

// <angle> or the unitless 0 CSS still allows in a gradient for legacy reasons.
function parseGradientAngle (raw: string): number | null {
  const angle = parseAngle(raw)
  if (angle !== null) return angle
  const numeric = parseNumeric(raw)
  return numeric && !numeric.percent && numeric.value === 0 ? 0 : null
}

const SIDE_OR_CORNER_ANGLES = new Map([
  ['top', 0],
  ['right', 90],
  ['bottom', 180],
  ['left', 270],
  ['top right', 45],
  ['bottom right', 135],
  ['bottom left', 225],
  ['top left', 315]
])

function parseLinearDirection (raw: string): number | null {
  const keywords = raw.match(/^to\s+(top|right|bottom|left)(?:\s+(top|right|bottom|left))?$/i)
  if (!keywords) return parseGradientAngle(raw)
  // Corners are valid in either order; the lookup is vertical-first.
  const sides = keywords.slice(1).filter((side) => side !== undefined).map((side) => side.toLowerCase())
  if (sides[0] === 'left' || sides[0] === 'right') sides.reverse()
  return SIDE_OR_CORNER_ANGLES.get(sides.join(' ')) ?? null
}

function parseConicFrom (raw: string): number | null {
  const from = raw.match(/^from\s+(\S+)$/i)
  return from ? parseGradientAngle(from[1]!) : null
}

const GRADIENT_RE = /^(linear|radial|conic)-gradient\(([\s\S]*)\)$/i

// CSS defaults for an omitted direction: linear runs `to bottom`, conic
// starts from 0deg.
const DEFAULT_ANGLES = { linear: 180, conic: 0 }

/**
 * Parse a CSS gradient into the editor model, or null when the value falls
 * outside the supported grammar:
 *
 *   linear-gradient([<direction>,] <stops>)
 *   radial-gradient(circle at center, <stops>)
 *   conic-gradient([from <angle>,] <stops>)
 *
 * `<direction>` is an angle (`deg`, `turn`, `rad`, `grad`, or a unitless 0)
 * or `to <side-or-corner>`; omitted, it defaults to 180 (`to bottom`) like
 * CSS. Corner keywords map to fixed diagonals — `to top right` is 45,
 * `to bottom right` 135, `to bottom left` 225, `to top left` 315 — which is an
 * approximation: CSS aims a corner direction at the box's actual corner, so
 * its angle depends on the aspect ratio. An omitted conic `from` is 0, and
 * `at <position>` is not supported. Stops follow parseGradientStops.
 *
 * The result is canonical (stops as `#RRGGBBAA`, angle in whole degrees
 * 0–359), so serializeGradient emits the canonical form and never
 * reproduces `rgba()` or `to` keywords.
 */
export function parseGradient (input: string): ParsedGradient | null {
  const match = input.trim().match(GRADIENT_RE)
  if (!match) return null
  const type = match[1]!.toLowerCase() as GradientType
  const [first, ...rest] = splitTopLevel(match[2]!) as [string, ...string[]]

  if (type === 'radial') {
    if (!/^circle\s+at\s+center$/i.test(first.trim())) return null
    const stops = parseStopSegments(rest)
    return stops && { type, stops }
  }

  // A first part that is not a direction must be the first stop: the
  // direction was omitted. parseStopSegments rejects it if it is neither.
  const direction = type === 'linear' ? parseLinearDirection(first.trim()) : parseConicFrom(first.trim())
  const stops = parseStopSegments(direction === null ? [first, ...rest] : rest)
  return stops && { type, angle: normalizeAngle(direction ?? DEFAULT_ANGLES[type]), stops }
}

/**
 * Cheap prefix check for dispatching a model that can hold either a plain
 * color or a gradient. It does not guarantee that parseGradient succeeds;
 * use canParseGradient before switching an editor into gradient mode.
 */
export function isGradient (input: string): boolean {
  return /^(?:linear|radial|conic)-gradient\(/i.test(input.trim())
}

/** Whether parseGradient accepts the value: the full check behind isGradient. */
export function canParseGradient (input: string): boolean {
  return parseGradient(input) !== null
}
