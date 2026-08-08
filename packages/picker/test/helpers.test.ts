import { describe, it, expect } from 'vitest'
import { clamp, chunk } from '../src/utils/helpers.ts'

describe('clamp', () => {
  it('clamps into the default 0-1 range', () => {
    expect(clamp(5)).toBe(1)
    expect(clamp(-2)).toBe(0)
    expect(clamp(0.4)).toBe(0.4)
  })

  it('respects custom bounds', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-5, -1, 1)).toBe(-1)
  })
})

describe('chunk', () => {
  it('splits a string into fixed-size chunks', () => {
    expect(chunk('B63DDA', 2)).toEqual(['B6', '3D', 'DA'])
    expect(chunk('abc')).toEqual(['a', 'b', 'c'])
  })

  it('keeps a short tail chunk', () => {
    expect(chunk('abcde', 2)).toEqual(['ab', 'cd', 'e'])
    expect(chunk('', 2)).toEqual([])
  })
})
