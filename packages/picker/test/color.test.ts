import { describe, it, expect } from 'vitest'
import {
  HSLtoHSV, HSVtoHSL, HSVtoRGB, RGBtoHSV,
  toHex, RGBtoHex, RGBAtoHexa, HexToRGB, HexaToRGBA, RGBAtoCSS
} from '../src/utils/color.ts'

describe('HSV <-> RGB', () => {
  it('converts primary hues', () => {
    expect(HSVtoRGB({ h: 0, s: 1, v: 1 })).toEqual({ r: 255, g: 0, b: 0 })
    expect(HSVtoRGB({ h: 120, s: 1, v: 1 })).toEqual({ r: 0, g: 255, b: 0 })
    expect(HSVtoRGB({ h: 240, s: 1, v: 1 })).toEqual({ r: 0, g: 0, b: 255 })
  })

  it('handles the grayscale axis', () => {
    expect(HSVtoRGB({ h: 0, s: 0, v: 1 })).toEqual({ r: 255, g: 255, b: 255 })
    expect(HSVtoRGB({ h: 180, s: 0, v: 0.5 })).toEqual({ r: 128, g: 128, b: 128 })
    expect(RGBtoHSV({ r: 255, g: 255, b: 255 })).toEqual({ h: 0, s: 0, v: 1 })
    expect(RGBtoHSV({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, v: 0 })
  })

  it('round-trips through both directions', () => {
    for (const rgb of [{ r: 255, g: 0, b: 0 }, { r: 12, g: 200, b: 99 }, { r: 1, g: 2, b: 3 }]) {
      expect(HSVtoRGB(RGBtoHSV(rgb))).toEqual(rgb)
    }
  })

  it('guards a nullish input', () => {
    expect(RGBtoHSV(null as never)).toEqual({ h: 0, s: 1, v: 1 })
  })

  it('normalizes negative hue offsets', () => {
    // A blue-magenta hue whose intermediate calculation dips negative.
    const hsv = RGBtoHSV({ r: 255, g: 0, b: 128 })
    expect(hsv.h).toBeGreaterThan(0)
    expect(hsv.h).toBeLessThan(360)
  })
})

describe('HSL <-> HSV', () => {
  it('converts the canonical anchors', () => {
    expect(HSLtoHSV({ h: 0, s: 1, l: 0.5 })).toEqual({ h: 0, s: 1, v: 1 })
    expect(HSVtoHSL({ h: 0, s: 1, v: 1 })).toEqual({ h: 0, s: 1, l: 0.5 })
  })

  it('zeroes saturation at the lightness extremes', () => {
    expect(HSVtoHSL({ h: 200, s: 0, v: 1 }).s).toBe(0)
    expect(HSVtoHSL({ h: 200, s: 1, v: 0 }).s).toBe(0)
  })

  it('round-trips interior colors', () => {
    const hsl = { h: 210, s: 0.4, l: 0.3 }
    const back = HSVtoHSL(HSLtoHSV(hsl))
    expect(back.h).toBe(hsl.h)
    expect(back.s).toBeCloseTo(hsl.s, 10)
    expect(back.l).toBeCloseTo(hsl.l, 10)
  })
})

describe('hex serialization', () => {
  it('pads and uppercases channel bytes', () => {
    expect(toHex(0)).toBe('00')
    expect(toHex(10)).toBe('0A')
    expect(toHex(255)).toBe('FF')
  })

  it('round-trips RGB and RGBA through hex strings', () => {
    expect(RGBtoHex({ r: 182, g: 61, b: 218 })).toBe('#B63DDA')
    expect(HexToRGB('#B63DDA')).toEqual({ r: 182, g: 61, b: 218 })

    // The 1.0.2 regression case: an 8-bit alpha byte must survive bit-exact.
    const rgba = HexaToRGBA('#FF8D2825')
    expect(RGBAtoHexa(rgba)).toBe('#FF8D2825')
    expect(rgba.a).toBeCloseTo(0x25 / 255, 10)
  })

  it('renders css rgba strings', () => {
    expect(RGBAtoCSS({ r: 1, g: 2, b: 3, a: 0.5 })).toBe('rgba(1, 2, 3, 0.5)')
  })
})
