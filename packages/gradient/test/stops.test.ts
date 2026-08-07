import { describe, it, expect } from 'vitest'
import { clampPosition, colorAt, diffPositions, midpointStop, mixHexa, reverseStops } from '../src/core/stops'

describe('clampPosition', () => {
  it('clamps and rounds to the 0-100 integer range', () => {
    expect(clampPosition(150)).toBe(100)
    expect(clampPosition(-5)).toBe(0)
    expect(clampPosition(49.5)).toBe(50)
    expect(clampPosition(NaN)).toBe(0)
  })
})

describe('mixHexa', () => {
  it('mixes RGBA channels linearly', () => {
    expect(mixHexa('#000000FF', '#FFFFFFFF')).toBe('#808080FF')
    expect(mixHexa('#000000FF', '#FFFFFFFF', 0)).toBe('#000000FF')
    expect(mixHexa('#000000FF', '#FFFFFFFF', 1)).toBe('#FFFFFFFF')
  })

  it('mixes alpha too', () => {
    expect(mixHexa('#FF000000', '#FF0000FF')).toBe('#FF000080')
  })
})

describe('midpointStop', () => {
  it('is halfway in both position and color', () => {
    expect(midpointStop(
      { position: 0, color: '#000000FF' },
      { position: 100, color: '#FFFFFFFF' }
    )).toEqual({ position: 50, color: '#808080FF' })
  })
})

describe('colorAt', () => {
  const stops = [
    { position: 0, color: '#000000FF' },
    { position: 50, color: '#FFFFFFFF' },
    { position: 100, color: '#000000FF' }
  ]

  it('clamps outside the stop range', () => {
    expect(colorAt(stops, -10)).toBe('#000000FF')
    expect(colorAt(stops, 0)).toBe('#000000FF')
    expect(colorAt(stops, 100)).toBe('#000000FF')
  })

  it('interpolates inside the right segment', () => {
    expect(colorAt(stops, 25)).toBe('#808080FF')
    expect(colorAt(stops, 75)).toBe('#808080FF')
    expect(colorAt(stops, 50)).toBe('#FFFFFFFF')
  })

  it('handles empty and zero-width segments', () => {
    expect(colorAt([], 50)).toBe('#000000FF')
    expect(colorAt([
      { position: 50, color: '#FF0000FF' },
      { position: 50, color: '#0000FFFF' }
    ], 50)).toBe('#FF0000FF')
  })
})

describe('reverseStops', () => {
  it('mirrors positions, keeps colors attached and preserves extra props', () => {
    const reversed = reverseStops([
      { id: 1, position: 0, color: '#FF0000FF' },
      { id: 2, position: 30, color: '#00FF00FF' },
      { id: 3, position: 100, color: '#0000FFFF' }
    ])
    expect(reversed).toEqual([
      { id: 3, position: 0, color: '#0000FFFF' },
      { id: 2, position: 70, color: '#00FF00FF' },
      { id: 1, position: 100, color: '#FF0000FF' }
    ])
  })
})

describe('diffPositions', () => {
  it('finds the single moved value', () => {
    expect(diffPositions([0, 50, 100], [0, 60, 100])).toEqual({ from: 50, to: 60 })
  })

  it('returns null when nothing moved', () => {
    expect(diffPositions([0, 50, 100], [0, 50, 100])).toBeNull()
  })

  it('resolves moves between duplicate positions', () => {
    expect(diffPositions([10, 50, 50], [10, 45, 50])).toEqual({ from: 50, to: 45 })
  })

  it('returns null for mismatched lists', () => {
    expect(diffPositions([0, 100], [0, 50, 100])).toBeNull()
  })
})
