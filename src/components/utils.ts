import { chunk, has } from './helpers'
import { DEFAULT_COLOR } from './consts'
import { Point, Gradient, Color, HSLA, RGBA, HSVA, Hex, Hexa } from './types'

export const pointsToCSSGradient = (points: Point[], angle = 135): string => {
  const colors = points
    .map(p => `rgba(${p.r},${p.g},${p.b},${p.a}) ${p.left.toFixed(2)}%`)
    .join(',')
  return `linear-gradient(${angle}deg, ${colors})`
}

export function parseGradient (str: string): Gradient {
  const angleRegex = /([0-9]*)deg/
  const angleResult = str.match(angleRegex)
  const angle = angleResult ? parseInt(angleResult[1]) : 0
  const pointRegex = /rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)\s*(\d+(\.\d+)?)%/g
  const points =
    [...str.matchAll(pointRegex)]
    .map((item) => ({
      r: parseInt(item[1]),
      g: parseInt(item[2]),
      b: parseInt(item[3]),
      a: parseInt(item[4]),
      left: parseFloat(item[5])
    }))
  return {
    angle,
    points
  }
}

export function isHex (input: string): boolean {
  return /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(input)
}

export function isGradient (input: string): boolean {
  return typeof input === 'string' && input.startsWith('linear-gradient')
}

export function normalizeHex (input: string) {
  const value = input.substring(input.indexOf('#') + 1)
  if (input.length < 6) {
    return '#' + value.split('').map(h => h + h).join('') + 'FF'
  }
  if (input.length === 6) {
    return '#' + value + 'FF'
  }
  return input
}

export function alphaToHex (a: number): string {
  return Math.floor(a * 255).toString(16).padStart(2, '0')
}

export function parseColor (color: any) {
  if (typeof color === 'string') {
    if (color === 'transparent') {
      return fromHexa('#00000000')
    }

    if (isHex(color)) {
      const hexa = normalizeHex(color)
      return fromHexa(hexa)
    }
  }

  if (typeof color === 'object') {
    const a = has(color, ['a']) ? parseFloat(color.a) : 1
    if (has(color, ['r', 'g', 'b'])) {
      return fromRGBA({ ...color, a })
    }
    if (has(color, ['h', 's', 'l'])) {
      return fromHSLA({ ...color, a })
    }
    if (has(color, ['h', 's', 'v'])) {
      return fromHSVA({ ...color, a })
    }
  }

  return fromRGBA(DEFAULT_COLOR)
}

/**
 * Converts HSVA to RGBA. Based on formula from https://en.wikipedia.org/wiki/HSL_and_HSV
 *
 * @param color HSVA color as an array [0-360, 0-1, 0-1, 0-1]
 */
export function HSVAtoRGBA (hsva: HSVA): RGBA {
  const { h, s, v, a } = hsva
  const f = (n: number) => {
    const k = (n + (h / 60)) % 6
    return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0)
  }
  const rgb = [f(5), f(3), f(1)].map(v => Math.round(v * 255))
  return { r: rgb[0], g: rgb[1], b: rgb[2], a }
}

/**
 * Converts RGBA to HSVA. Based on formula from https://en.wikipedia.org/wiki/HSL_and_HSV
 *
 * @param color RGBA color as an array [0-255, 0-255, 0-255, 0-1]
 */
export function RGBAtoHSVA (rgba: RGBA): HSVA {
  if (!rgba) return { h: 0, s: 1, v: 1, a: 1 }

  const r = rgba.r / 255
  const g = rgba.g / 255
  const b = rgba.b / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  let h = 0

  if (max !== min) {
    if (max === r) {
      h = 60 * (0 + ((g - b) / (max - min)))
    } else if (max === g) {
      h = 60 * (2 + ((b - r) / (max - min)))
    } else if (max === b) {
      h = 60 * (4 + ((r - g) / (max - min)))
    }
  }

  if (h < 0) h = h + 360

  const s = max === 0 ? 0 : (max - min) / max
  const hsv = [h, s, max]

  return { h: hsv[0], s: hsv[1], v: hsv[2], a: rgba.a }
}

export function RGBAtoHex (rgba: RGBA): Hex {
  const toHex = (v: number) => {
    const h = Math.round(v).toString(16)
    return ('00'.substring(0, 2 - h.length) + h).toUpperCase()
  }

  return `#${[
    toHex(rgba.r),
    toHex(rgba.g),
    toHex(rgba.b),
    toHex(Math.round(rgba.a * 255)),
  ].join('')}`
}

export function RGBAtoCSS (rgba: RGBA): string {
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`
}

export function HexToRGBA (hex: Hex): RGBA {
  const rgba = chunk(hex.slice(1), 2).map((c: string) => parseInt(c, 16))

  return {
    r: rgba[0],
    g: rgba[1],
    b: rgba[2],
    a: Math.round((rgba[3] / 255) * 100) / 100,
  }
}

export function HexToHSVA (hex: Hex): HSVA {
  const rgb = HexToRGBA(hex)
  return RGBAtoHSVA(rgb)
}

export function HSVAtoHex (hsva: HSVA): Hex {
  return RGBAtoHex(HSVAtoRGBA(hsva))
}

export function HSVAtoHSLA (hsva: HSVA): HSLA {
  const { h, s, v, a } = hsva
  const l = v - (v * s / 2)
  const sprime = l === 1 || l === 0 ? 0 : (v - l) / Math.min(l, 1 - l)
  return { h, s: sprime, l, a }
}

export function HSLAtoHSVA (hsl: HSLA): HSVA {
  const { h, s, l, a } = hsl
  const v = l + s * Math.min(l, 1 - l)
  const sprime = v === 0 ? 0 : 2 - (2 * l / v)
  return { h, s: sprime, v, a }
}

export function fromHSVA (hsva: HSVA): Color {
  hsva = { ...hsva }
  const hexa = HSVAtoHex(hsva)
  const hsla = HSVAtoHSLA(hsva)
  const rgba = HSVAtoRGBA(hsva)
  return {
    alpha: hsva.a,
    hex: hexa.substring(0, 7),
    hexa,
    hsla,
    hsva,
    hue: hsva.h,
    rgba,
  }
}

export function fromHSLA (hsla: HSLA): Color {
  const hsva = HSLAtoHSVA(hsla)
  const hexa = HSVAtoHex(hsva)
  const rgba = HSVAtoRGBA(hsva)
  return {
    alpha: hsva.a,
    hex: hexa.substring(0, 7),
    hexa,
    hsla,
    hsva,
    hue: hsva.h,
    rgba,
  }
}

export function fromRGBA (rgba: RGBA): Color {
  const hsva = RGBAtoHSVA(rgba)
  const hexa = RGBAtoHex(rgba)
  const hsla = HSVAtoHSLA(hsva)
  return {
    alpha: hsva.a,
    hex: hexa.substring(0, 7),
    hexa,
    hsla,
    hsva,
    hue: hsva.h,
    rgba,
  }
}

export function fromHexa (hexa: Hexa): Color {
  const hsva = HexToHSVA(hexa)
  const hsla = HSVAtoHSLA(hsva)
  const rgba = HSVAtoRGBA(hsva)
  return {
    alpha: hsva.a,
    hex: hexa.substring(0, 7),
    hexa,
    hsla,
    hsva,
    hue: hsva.h,
    rgba,
  }
}