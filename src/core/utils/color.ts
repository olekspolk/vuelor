import type { Hex, HSL, HSV, RGB, RGBA } from './types.ts'
import { chunk } from './helpers.ts'

export function HSLtoHSV (hsl: HSL): HSV {
  const { h, s, l } = hsl
  const v = l + s * Math.min(l, 1 - l)
  const sprime = v === 0 ? 0 : 2 - (2 * l / v)
  return { h, s: sprime, v}
}

export function HSVtoHSL (hsv: HSV): HSL {
  const { h, s, v } = hsv
  const l = v - (v * s / 2)
  const sprime = l === 1 || l === 0 ? 0 : (v - l) / Math.min(l, 1 - l)
  return { h, s: sprime, l }
}

/**
 * Converts HSV to RGB. Based on formula from https://en.wikipedia.org/wiki/HSL_and_HSV
 *
 * @param color HSV color as an array [0-360, 0-1, 0-1]
 */
export function HSVtoRGB (hsv: HSV): RGB {
  const { h, s, v } = hsv
  const f = (n: number) => {
    const k = (n + (h / 60)) % 6
    return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0)
  }
  const rgb = [f(5), f(3), f(1)].map(v => Math.round(v * 255))
  return { r: rgb[0] as number, g: rgb[1] as number, b: rgb[2] as number }
}

/**
 * Converts RGB to HSV. Based on formula from https://en.wikipedia.org/wiki/HSL_and_HSV
 *
 * @param color RGB color as an array [0-255, 0-255, 0-255]
 */
export function RGBtoHSV (rgba: RGB): HSV {
  if (!rgba) return { h: 0, s: 1, v: 1 }

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

  return { h: hsv[0] as number, s: hsv[1] as number, v: hsv[2] as number }
}

export const toHex = (v: number) => {
  const h = Math.round(v).toString(16)
  return ('00'.substring(0, 2 - h.length) + h).toUpperCase()
}

export function RGBtoHex (rgb: RGB): Hex {
  return `#${[
    toHex(rgb.r),
    toHex(rgb.g),
    toHex(rgb.b),
  ].join('')}`
}

export function HexToRGB (hex: Hex): RGB {
  const rgb = chunk(hex.slice(1), 2).map((c: string) => parseInt(c, 16))
  return {
    r: rgb[0] as number,
    g: rgb[1] as number,
    b: rgb[2] as number
  }
}

export function RGBAtoCSS (rgba: RGBA): string {
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`
}
