import { describe, it, expect } from 'vitest'
import {
  isGradient,
  normalizeAngle,
  normalizeHexa,
  parseGradient,
  parseGradientStops,
  splitTopLevel
} from '../src/core/parse'

describe('normalizeHexa', () => {
  it('expands short forms to #RRGGBBAA', () => {
    expect(normalizeHexa('#f00')).toBe('#FF0000FF')
    expect(normalizeHexa('#f00a')).toBe('#FF0000AA')
    expect(normalizeHexa('#FF0000')).toBe('#FF0000FF')
    expect(normalizeHexa('#ff000080')).toBe('#FF000080')
  })

  it('accepts a missing hash', () => {
    expect(normalizeHexa('f00')).toBe('#FF0000FF')
  })

  it('rejects invalid input', () => {
    expect(normalizeHexa('#12345')).toBeNull()
    expect(normalizeHexa('#gggggg')).toBeNull()
    expect(normalizeHexa('red')).toBeNull()
  })
})

describe('normalizeAngle', () => {
  it('wraps into 0-359 and rounds', () => {
    expect(normalizeAngle(450)).toBe(90)
    expect(normalizeAngle(-90)).toBe(270)
    expect(normalizeAngle(360)).toBe(0)
    expect(normalizeAngle('123.6')).toBe(124)
  })

  it('falls back to 0 for non-numeric input', () => {
    expect(normalizeAngle('abc')).toBe(0)
    expect(normalizeAngle(NaN)).toBe(0)
  })
})

describe('splitTopLevel', () => {
  it('ignores separators inside parentheses', () => {
    expect(splitTopLevel('#f00, rgb(1, 2, 3), #00f')).toEqual(['#f00', ' rgb(1, 2, 3)', ' #00f'])
  })
})

describe('parseGradientStops', () => {
  it('parses explicit positions', () => {
    expect(parseGradientStops('#FF0000FF 0%, #0000FFFF 100%')).toEqual([
      { color: '#FF0000FF', position: 0 },
      { color: '#0000FFFF', position: 100 }
    ])
  })

  it('applies CSS defaulting rules to missing positions', () => {
    expect(parseGradientStops('#f00, #0f0, #00f')?.map((s) => s.position)).toEqual([0, 50, 100])
    expect(parseGradientStops('#f00 0%, #0f0, #00f, #fff 90%')?.map((s) => s.position)).toEqual([0, 30, 60, 90])
  })

  it('keeps positions monotonic and in range', () => {
    expect(parseGradientStops('#f00 50%, #0f0 20%, #00f')?.map((s) => s.position)).toEqual([50, 50, 100])
    expect(parseGradientStops('#f00 -10%, #00f 150%')?.map((s) => s.position)).toEqual([0, 100])
  })

  it('rounds decimal positions', () => {
    expect(parseGradientStops('#f00 33.4%, #00f 66.6%')?.map((s) => s.position)).toEqual([33, 67])
  })

  it('rejects lists that are not fully valid', () => {
    expect(parseGradientStops('#f00 50%')).toBeNull()
    expect(parseGradientStops('#f00 0%, notacolor 100%')).toBeNull()
    expect(parseGradientStops('#f00 0%, rgb(0, 0, 255) 100%')).toBeNull()
  })
})

describe('parseGradient', () => {
  it('parses linear gradients', () => {
    expect(parseGradient('linear-gradient(90deg, #FF0000FF 0%, #0000FFFF 100%)')).toEqual({
      type: 'linear',
      angle: 90,
      stops: [
        { color: '#FF0000FF', position: 0 },
        { color: '#0000FFFF', position: 100 }
      ]
    })
  })

  it('normalizes angles and hex forms, tolerating case and whitespace', () => {
    expect(parseGradient('  LINEAR-GRADIENT(-90DEG, #f00, #00f)  ')).toEqual({
      type: 'linear',
      angle: 270,
      stops: [
        { color: '#FF0000FF', position: 0 },
        { color: '#0000FFFF', position: 100 }
      ]
    })
  })

  it('parses radial gradients without an angle', () => {
    expect(parseGradient('radial-gradient(circle at center, #f00, #00f)')).toEqual({
      type: 'radial',
      stops: [
        { color: '#FF0000FF', position: 0 },
        { color: '#0000FFFF', position: 100 }
      ]
    })
  })

  it('parses conic gradients', () => {
    expect(parseGradient('conic-gradient(from 45deg, #f00, #00f)')).toEqual({
      type: 'conic',
      angle: 45,
      stops: [
        { color: '#FF0000FF', position: 0 },
        { color: '#0000FFFF', position: 100 }
      ]
    })
  })

  it('rejects unsupported grammar', () => {
    expect(parseGradient('linear-gradient(to right, #f00, #00f)')).toBeNull()
    expect(parseGradient('linear-gradient(90deg, #f00)')).toBeNull()
    expect(parseGradient('red')).toBeNull()
  })
})

describe('isGradient', () => {
  it('detects gradient-shaped values', () => {
    expect(isGradient('linear-gradient(90deg, #f00, #00f)')).toBe(true)
    expect(isGradient('  conic-gradient(x)')).toBe(true)
    expect(isGradient('#ff0000')).toBe(false)
    expect(isGradient('rgba(1, 2, 3, 0.5)')).toBe(false)
  })
})
