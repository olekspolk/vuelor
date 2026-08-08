import { describe, it, expect } from 'vitest'
import {
  parseHex, getHexColorFromHexString, getAlphaFromHexString,
  parseRGB, parseRGBA, parseHSL, parseHSLA, parseHSV, parseHSVA
} from '../src/utils/parsers.ts'

describe('parseHex', () => {
  it('accepts 3/4/6/8-digit forms with an optional hash', () => {
    expect(parseHex('#f00')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
    expect(parseHex('f00a')).toEqual({ r: 255, g: 0, b: 0, a: 0xAA / 255 })
    expect(parseHex('#B63DDA')).toEqual({ r: 182, g: 61, b: 218, a: 1 })
    expect(parseHex('B63DDA80')?.a).toBeCloseTo(0x80 / 255, 10)
  })

  it('trims surrounding whitespace', () => {
    expect(parseHex('  #f00  ')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
  })

  it('rejects malformed input', () => {
    expect(parseHex('#12345')).toBeNull()
    expect(parseHex('red')).toBeNull()
    expect(parseHex('')).toBeNull()
  })
})

describe('hex string helpers', () => {
  it('extracts the color part', () => {
    expect(getHexColorFromHexString('#B63DDAFF')).toBe('B63DDA')
    expect(getHexColorFromHexString('')).toBeNull()
  })

  it('extracts alpha as a whole percentage', () => {
    expect(getAlphaFromHexString('#B63DDA80')).toBe(50)
    expect(getAlphaFromHexString('#B63DDAFF')).toBe(100)
    expect(getAlphaFromHexString('#B63DDA')).toBe(100)
    expect(getAlphaFromHexString('')).toBe(100)
  })
})

describe('functional color strings', () => {
  it('parses rgb and rgba', () => {
    expect(parseRGB('rgb(10, 20, 30)')).toEqual({ r: 10, g: 20, b: 30 })
    expect(parseRGBA('rgba(10, 20, 30, 0.25)')).toEqual({ r: 10, g: 20, b: 30, a: 0.25 })
    // rgb() is accepted by the rgba parser with alpha defaulting to 1.
    expect(parseRGBA('rgb(10, 20, 30)')).toEqual({ r: 10, g: 20, b: 30, a: 1 })
  })

  it('parses hsl(a) with percentage or fractional channels', () => {
    expect(parseHSL('hsl(120, 50%, 40%)')).toEqual({ h: 120, s: 0.5, l: 0.4 })
    expect(parseHSL('hsl(120, 0.5, 0.4)')).toEqual({ h: 120, s: 0.5, l: 0.4 })
    expect(parseHSLA('hsla(120, 50%, 40%, 0.5)')).toEqual({ h: 120, s: 0.5, l: 0.4, a: 0.5 })
  })

  it('parses hsv(a)', () => {
    expect(parseHSV('hsv(300, 72%, 85.5%)')).toEqual({ h: 300, s: 0.72, v: 0.855 })
    expect(parseHSVA('hsva(300, 72%, 85.5%, 0.33)')).toEqual({ h: 300, s: 0.72, v: 0.855, a: 0.33 })
  })

  it('falls back to defaults on malformed or mismatched input', () => {
    expect(parseRGB('not-a-color')).toEqual({ r: 255, g: 0, b: 0 })
    expect(parseRGB('hsl(1, 2, 3)')).toEqual({ r: 255, g: 0, b: 0 })
    expect(parseRGBA('nope')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
    expect(parseHSL('rgb(1, 2, 3)')).toEqual({ h: 0, s: 0, l: 0 })
    expect(parseHSLA('nope')).toEqual({ h: 0, s: 0, l: 0, a: 1 })
    expect(parseHSV('nope')).toEqual({ h: 0, s: 0, v: 0 })
    expect(parseHSVA('hsv(1, 2, 3)')).toEqual({ h: 0, s: 0, v: 0, a: 1 })
  })
})
