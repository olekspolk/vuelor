import { describe, it, expect } from 'vitest'
import { useColor } from '../src/composables/useColor.ts'

describe('useColor', () => {
  it('round-trips an 8-bit alpha byte bit-exact through hexa', () => {
    const color = useColor()
    color.hexa.value = '#FF8D2825'
    expect(color.hexa.value).toBe('#FF8D2825')
    expect(color.alpha.value).toBeCloseTo(0x25 / 255, 10)
  })

  it('keeps alpha when only the hex (no-alpha) channel changes', () => {
    const color = useColor()
    color.hexa.value = '#FF000080'
    color.hex.value = '#00FF00'
    expect(color.hexa.value).toBe('#00FF0080')
  })

  it('synchronizes all representations from an rgba write', () => {
    const color = useColor()
    color.rgba.value = { r: 255, g: 0, b: 0, a: 0.5 }
    expect(color.hex.value).toBe('#FF0000')
    expect(color.hsl.value).toEqual({ h: 0, s: 1, l: 0.5 })
    expect(color.hsv.value).toEqual({ h: 0, s: 1, v: 1 })
    expect(color.hsla.value.a).toBe(0.5)
    expect(color.hsva.value.a).toBe(0.5)
  })

  it('serializes every string format', () => {
    const color = useColor()
    color.hexa.value = '#FF0000FF'
    expect(color.toFormat('hex')).toBe('#FF0000')
    expect(color.toFormat('hexa')).toBe('#FF0000FF')
    expect(color.toFormat('rgb')).toBe('rgb(255, 0, 0)')
    expect(color.toFormat('rgba')).toBe('rgba(255, 0, 0, 1.00)')
    expect(color.toFormat('hsl')).toBe('hsl(0, 100.0%, 50.0%)')
    expect(color.toFormat('hsla')).toBe('hsla(0, 100.0%, 50.0%, 1.00)')
    expect(color.toFormat('hsv')).toBe('hsv(0, 100.0%, 100.0%)')
    expect(color.toFormat('hsva')).toBe('hsva(0, 100.0%, 100.0%, 1.00)')
    expect(color.toFormat('unknown' as never)).toBe('#FF0000')
  })

  it('serializes and re-imports the object format', () => {
    const color = useColor()
    color.hexa.value = '#B63DDA80'
    const snapshot = color.toObject()
    expect(snapshot.hexa).toBe('#B63DDA80')

    const other = useColor()
    other.fromFormat(snapshot, 'object')
    expect(other.hexa.value).toBe('#B63DDA80')
    expect(other.alpha.value).toBeCloseTo(0x80 / 255, 10)
  })

  it('parses every supported string format through fromFormat', () => {
    const color = useColor()
    color.fromFormat('rgb(10, 20, 30)', 'rgb')
    expect(color.rgb.value).toEqual({ r: 10, g: 20, b: 30 })

    color.fromFormat('rgba(10, 20, 30, 0.25)', 'rgba')
    expect(color.rgba.value.a).toBe(0.25)

    color.fromFormat('hsl(120, 50%, 50%)', 'hsl')
    expect(color.hsl.value.h).toBe(120)

    color.fromFormat('hsla(120, 50%, 50%, 0.5)', 'hsla')
    expect(color.hsla.value.a).toBe(0.5)

    color.fromFormat('hsv(240, 100%, 100%)', 'hsv')
    expect(color.hsv.value.h).toBe(240)

    color.fromFormat('hsva(240, 100%, 100%, 0.4)', 'hsva')
    expect(color.hsva.value.a).toBe(0.4)

    color.fromFormat('#f00', 'hex')
    expect(color.hex.value).toBe('#FF0000')

    color.fromFormat('#00ff0080', 'hexa')
    expect(color.hexa.value).toBe('#00FF0080')
  })

  it('ignores an unparseable hex write', () => {
    const color = useColor()
    color.hexa.value = '#FF0000FF'
    color.fromFormat('garbage', 'hexa')
    expect(color.hexa.value).toBe('#FF0000FF')
  })
})
