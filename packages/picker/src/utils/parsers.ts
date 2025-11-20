import type { RGB, RGBA, HSL, HSLA, HSV, HSVA } from './types.ts'

export function parseHex(hex: string): RGBA | null {
  const s = hex.trim()

  const m6  = s.match(/^#?(?<r>[A-Fa-f0-9]{2})(?<g>[A-Fa-f0-9]{2})(?<b>[A-Fa-f0-9]{2})$/)
  if (m6?.groups) {
    const { r, g, b } = m6.groups
    return {
      r: parseInt(r as string, 16),
      g: parseInt(g as string, 16),
      b: parseInt(b as string, 16),
      a: 1
    }
  }

  const m8  = s.match(/^#?(?<r>[A-Fa-f0-9]{2})(?<g>[A-Fa-f0-9]{2})(?<b>[A-Fa-f0-9]{2})(?<a>[A-Fa-f0-9]{2})$/)
  if (m8?.groups) {
    const { r, g, b, a } = m8.groups as { r: string; g: string; b: string; a: string; }
    return {
      r: parseInt(r, 16),
      g: parseInt(g, 16),
      b: parseInt(b, 16),
      a: parseInt(a, 16) / 255
    }
  }

  const m3  = s.match(/^#?(?<r>[A-Fa-f0-9])(?<g>[A-Fa-f0-9])(?<b>[A-Fa-f0-9])$/)
  if (m3?.groups) {
    const { r, g, b } = m3.groups as { r: string; g: string; b: string; }
    const rr = r + r, gg = g + g, bb = b + b
    return {
      r: parseInt(rr, 16),
      g: parseInt(gg, 16),
      b: parseInt(bb, 16),
      a: 1
    }
  }

  const m4  = s.match(/^#?(?<r>[A-Fa-f0-9])(?<g>[A-Fa-f0-9])(?<b>[A-Fa-f0-9])(?<a>[A-Fa-f0-9])$/)
  if (m4?.groups) {
    const { r, g, b, a } = m4.groups as { r: string; g: string; b: string; a: string; }
    const rr = r + r, gg = g + g, bb = b + b, aa = a + a
    return {
      r: parseInt(rr, 16),
      g: parseInt(gg, 16),
      b: parseInt(bb, 16),
      a: parseInt(aa, 16) / 255
    }
  }

  return null
}

export function getHexColorFromHexString(hex: string): string | null {
  return hex ? hex.substring(0, 7).replace('#', '') : null
}

export function getAlphaFromHexString(hex: string): number | null {
  if (!hex || hex.length < 9) return 100
  const alphaHex = hex.substring(7, 9).replace('#', '')
  return Math.round(parseInt(alphaHex, 16) / 255 * 100)
}

function baseParser(str: string) {
  const colorRegex = /^([a-zA-Z]{3,4})\(\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)%?)\s*,\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)%?)\s*,\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)%?)(?:\s*,\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)%?))?\s*\)$/i
  const match = str.match(colorRegex)
  if (!match) return null

  const [, type, c1, c2, c3, c4] = match
  return {
    type,
    values: [c1, c2, c3, c4].filter(Boolean)
  }
}

function parsedToPercentage(value: string): number {
  return value.endsWith('%') ? parseFloat(value) / 100 : parseFloat(value)
}

export function parseRGB (str: string): RGB {
  const parsed = baseParser(str)
  if (parsed && (parsed.type?.toLowerCase() === 'rgb')) {
    return {
      r: parseInt(parsed.values[0] as string, 10),
      g: parseInt(parsed.values[1] as string, 10),
      b: parseInt(parsed.values[2] as string, 10)
    }
  }
  return { r: 255, g: 0, b: 0 }
}

export function parseRGBA (str: string): RGBA {
  const parsed = baseParser(str)
  if (parsed && (parsed.type?.toLowerCase() === 'rgb')) {
    return {
      r: parseInt(parsed.values[0] as string, 10),
      g: parseInt(parsed.values[1] as string, 10),
      b: parseInt(parsed.values[2] as string, 10),
      a: parsed.values[3] ? parseFloat(parsed.values[3] as string) : 1
    }
  }
  return { r: 255, g: 0, b: 0, a: 1 }
}

export function parseHSL (str: string): HSL {
  const parsed = baseParser(str)
  if (parsed && (parsed.type?.toLowerCase() === 'hsl')) {
    return {
      h: parseFloat(parsed.values[0] as string),
      s: parsedToPercentage(parsed.values[1] as string),
      l: parsedToPercentage(parsed.values[2] as string)
    }
  }
  return { h: 0, s: 0, l: 0 }
}

export function parseHSLA (str: string): HSLA {
  const parsed = baseParser(str)
  if (parsed && (parsed.type?.toLowerCase() === 'hsla')) {
    return {
      h: parseFloat(parsed.values[0] as string),
      s: parsedToPercentage(parsed.values[1] as string),
      l: parsedToPercentage(parsed.values[2] as string),
      a: parsed.values[3] ? parseFloat(parsed.values[3] as string) : 1
    }
  }
  return { h: 0, s: 0, l: 0, a: 1 }
}

export function parseHSV (str: string): HSV {
  const parsed = baseParser(str)
  if (parsed && (parsed.type?.toLowerCase() === 'hsv')) {
    return {
      h: parseFloat(parsed.values[0] as string),
      s: parsedToPercentage(parsed.values[1] as string),
      v: parsedToPercentage(parsed.values[2] as string)
    }
  }
  return { h: 0, s: 0, v: 0 }
}

export function parseHSVA (str: string): HSVA {
  const parsed = baseParser(str)
  if (parsed && (parsed.type?.toLowerCase() === 'hsva')) {
    return {
      h: parseFloat(parsed.values[0] as string),
      s: parsedToPercentage(parsed.values[1] as string),
      v: parsedToPercentage(parsed.values[2] as string),
      a: parsed.values[3] ? parseFloat(parsed.values[3] as string) : 1
    }
  }
  return { h: 0, s: 0, v: 0, a: 1 }
}
