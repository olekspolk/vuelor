import { describe, it, expect } from 'vitest'
import { useGradient } from '../src/composables/useGradient'
import { colorAt } from '../src/core/stops'

describe('useGradient', () => {
  it('starts from a sensible default gradient', () => {
    const gradient = useGradient()
    expect(gradient.stops.value).toHaveLength(2)
    expect(gradient.css.value).toBe('linear-gradient(90deg, #FF98C2FF 0%, #FFFA7AFF 100%)')
    expect(gradient.selectedStop.value).toBe(gradient.stops.value[0])
    expect(gradient.minStops).toBe(2)
    expect(gradient.maxStops).toBe(8)
  })

  it('sorts, clamps and normalizes initial stops', () => {
    const gradient = useGradient({
      stops: [
        { color: '#00f', position: 150 },
        { color: '#f00', position: -10 }
      ]
    })
    expect(gradient.stops.value.map((s) => ({ color: s.color, position: s.position }))).toEqual([
      { color: '#FF0000FF', position: 0 },
      { color: '#0000FFFF', position: 100 }
    ])
  })

  it('falls back to defaults when fewer than two stops are given', () => {
    const gradient = useGradient({ stops: [{ color: '#f00', position: 0 }] })
    expect(gradient.stops.value).toHaveLength(2)
  })

  describe('addStop', () => {
    it('splits the segment right of the selected stop at its midpoint', () => {
      const gradient = useGradient({
        stops: [
          { color: '#FF0000FF', position: 0 },
          { color: '#0000FFFF', position: 100 }
        ]
      })
      const added = gradient.addStop()
      expect(added).not.toBeNull()
      expect(added!.position).toBe(50)
      expect(added!.color).toBe('#800080FF')
      expect(gradient.selectedStopId.value).toBe(added!.id)
      expect(gradient.stops.value.map((s) => s.position)).toEqual([0, 50, 100])
    })

    it('splits the segment to the left when the last stop is selected', () => {
      const gradient = useGradient()
      const last = gradient.stops.value[1]!
      gradient.select(last.id)
      const added = gradient.addStop()
      expect(added!.position).toBe(50)
    })

    it('interpolates the color when adding at an explicit position', () => {
      const gradient = useGradient({
        stops: [
          { color: '#FF0000FF', position: 0 },
          { color: '#0000FFFF', position: 100 }
        ]
      })
      const expected = colorAt(gradient.stops.value, 25)
      const added = gradient.addStop(25)
      expect(added!.position).toBe(25)
      expect(added!.color).toBe(expected)
      expect(gradient.stops.value.map((s) => s.position)).toEqual([0, 25, 100])
    })

    it('refuses to grow past maxStops', () => {
      const gradient = useGradient({ maxStops: 3 })
      expect(gradient.addStop()).not.toBeNull()
      expect(gradient.canAddStop.value).toBe(false)
      expect(gradient.addStop()).toBeNull()
      expect(gradient.stops.value).toHaveLength(3)
    })
  })

  describe('removeStop', () => {
    it('removes the selected stop by default and reselects its left neighbour', () => {
      const gradient = useGradient()
      const added = gradient.addStop()!
      const first = gradient.stops.value[0]!
      expect(gradient.removeStop()).toBe(true)
      expect(gradient.stops.value.find((s) => s.id === added.id)).toBeUndefined()
      expect(gradient.selectedStopId.value).toBe(first.id)
    })

    it('refuses to shrink below minStops', () => {
      const gradient = useGradient()
      expect(gradient.canRemoveStop.value).toBe(false)
      expect(gradient.removeStop()).toBe(false)
      expect(gradient.stops.value).toHaveLength(2)
    })
  })

  it('keeps the selection on the same stop across re-sorting moves', () => {
    const gradient = useGradient({
      stops: [
        { color: '#FF0000FF', position: 0 },
        { color: '#00FF00FF', position: 50 },
        { color: '#0000FFFF', position: 100 }
      ]
    })
    const middle = gradient.stops.value[1]!
    gradient.select(middle.id)
    gradient.moveStop(gradient.stops.value[0]!.id, 70)
    expect(gradient.stops.value.map((s) => s.position)).toEqual([50, 70, 100])
    expect(gradient.selectedStop.value.id).toBe(middle.id)
    expect(gradient.selectedStop.value.position).toBe(50)
  })

  it('normalizes colors on setStopColor and ignores invalid ones', () => {
    const gradient = useGradient()
    const stop = gradient.stops.value[0]!
    gradient.setStopColor(stop.id, '#0f0')
    expect(stop.color).toBe('#00FF00FF')
    gradient.setStopColor(stop.id, 'zzz')
    expect(stop.color).toBe('#00FF00FF')
  })

  it('routes selectedColor writes to the selected stop', () => {
    const gradient = useGradient()
    gradient.selectedColor.value = '#123456'
    expect(gradient.stops.value[0]!.color).toBe('#123456FF')
  })

  it('reverses positions while keeping stop identity', () => {
    const gradient = useGradient({
      stops: [
        { color: '#FF0000FF', position: 0 },
        { color: '#00FF00FF', position: 30 },
        { color: '#0000FFFF', position: 100 }
      ]
    })
    const ids = gradient.stops.value.map((s) => s.id)
    gradient.reverse()
    expect(gradient.stops.value.map((s) => s.position)).toEqual([0, 70, 100])
    expect(gradient.stops.value.map((s) => s.id)).toEqual([...ids].reverse())
  })

  it('rotates with wrap-around', () => {
    const gradient = useGradient({ angle: 350 })
    gradient.rotate()
    expect(gradient.angle.value).toBe(80)
    gradient.rotate(-100)
    expect(gradient.angle.value).toBe(340)
  })

  describe('setFromCSS', () => {
    it('replaces the whole state and resets the selection', () => {
      const gradient = useGradient()
      expect(gradient.setFromCSS('conic-gradient(from 45deg, #f00 0%, #00f 100%)')).toBe(true)
      expect(gradient.type.value).toBe('conic')
      expect(gradient.angle.value).toBe(45)
      expect(gradient.stops.value.map((s) => s.color)).toEqual(['#FF0000FF', '#0000FFFF'])
      expect(gradient.selectedStop.value).toBe(gradient.stops.value[0])
    })

    it('leaves state untouched on invalid input', () => {
      const gradient = useGradient()
      const before = gradient.css.value
      expect(gradient.setFromCSS('not-a-gradient')).toBe(false)
      expect(gradient.css.value).toBe(before)
    })

    it('keeps the current angle when parsing a radial gradient', () => {
      const gradient = useGradient({ angle: 45 })
      gradient.setFromCSS('radial-gradient(circle at center, #f00, #00f)')
      expect(gradient.angle.value).toBe(45)
    })
  })

  it('serializes reactively', () => {
    const gradient = useGradient()
    gradient.moveStop(gradient.stops.value[0]!.id, 10)
    expect(gradient.css.value).toContain('#FF98C2FF 10%')
  })
})
