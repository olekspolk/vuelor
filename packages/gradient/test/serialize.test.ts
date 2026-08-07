import { describe, it, expect } from 'vitest'
import { parseGradient } from '../src/core/parse'
import { serializeGradient, serializeGradientStops, stopsToTrackCSS } from '../src/core/serialize'
import type { GradientStop } from '../src/core/types'

const stops: GradientStop[] = [
  { color: '#FF0000FF', position: 0 },
  { color: '#0000FFFF', position: 100 }
]

describe('serializeGradientStops', () => {
  it('joins stops in CSS form', () => {
    expect(serializeGradientStops(stops)).toBe('#FF0000FF 0%, #0000FFFF 100%')
  })
})

describe('serializeGradient', () => {
  it('serializes each type', () => {
    expect(serializeGradient({ type: 'linear', angle: 45, stops }))
      .toBe('linear-gradient(45deg, #FF0000FF 0%, #0000FFFF 100%)')
    expect(serializeGradient({ type: 'radial', stops }))
      .toBe('radial-gradient(circle at center, #FF0000FF 0%, #0000FFFF 100%)')
    expect(serializeGradient({ type: 'conic', angle: 180, stops }))
      .toBe('conic-gradient(from 180deg, #FF0000FF 0%, #0000FFFF 100%)')
  })

  it('ignores an angle on radial gradients', () => {
    expect(serializeGradient({ type: 'radial', angle: 45, stops }))
      .toBe('radial-gradient(circle at center, #FF0000FF 0%, #0000FFFF 100%)')
  })

  it('falls back to sensible angles when none is given', () => {
    expect(serializeGradient({ type: 'linear', stops })).toContain('linear-gradient(90deg,')
    expect(serializeGradient({ type: 'conic', stops })).toContain('conic-gradient(from 0deg,')
  })

  it('round-trips through parseGradient for every type', () => {
    for (const input of [
      'linear-gradient(270deg, #FF0000FF 0%, #00FF0080 40%, #0000FFFF 100%)',
      'radial-gradient(circle at center, #FF0000FF 0%, #0000FFFF 100%)',
      'conic-gradient(from 45deg, #FF0000FF 0%, #0000FFFF 100%)'
    ]) {
      const parsed = parseGradient(input)
      expect(parsed).not.toBeNull()
      expect(serializeGradient(parsed!)).toBe(input)
      expect(parseGradient(serializeGradient(parsed!))).toEqual(parsed)
    }
  })
})

describe('stopsToTrackCSS', () => {
  it('renders a flat strip', () => {
    expect(stopsToTrackCSS(stops)).toBe('linear-gradient(to right, #FF0000FF 0%, #0000FFFF 100%)')
    expect(stopsToTrackCSS(stops, 'to top')).toBe('linear-gradient(to top, #FF0000FF 0%, #0000FFFF 100%)')
  })
})
