import { describe, it, expect } from 'vitest'
import {
  canParseGradient,
  isGradient,
  normalizeAngle,
  normalizeColor,
  normalizeHexa,
  parseGradient,
  parseGradientStops,
  splitTopLevel
} from '../src/core/parse'
import { serializeGradient } from '../src/core/serialize'

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

  it('tolerates surrounding whitespace, matching the picker grammar', () => {
    expect(normalizeHexa('  #f00  ')).toBe('#FF0000FF')
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
    expect(parseGradientStops('#f00 0%, #00f 10px')).toBeNull()
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
    expect(parseGradient('radial-gradient(ellipse at top, #f00, #00f)')).toBeNull()
    expect(parseGradient('conic-gradient(from 45deg at center, #f00, #00f)')).toBeNull()
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

describe('canParseGradient', () => {
  it('is the full check isGradient does not make', () => {
    expect(isGradient('linear-gradient(180deg, )')).toBe(true)
    expect(canParseGradient('linear-gradient(180deg, )')).toBe(false)
    expect(canParseGradient('linear-gradient(to top, rgba(0, 0, 0, 0.5), #000)')).toBe(true)
    expect(canParseGradient('#ff0000')).toBe(false)
  })
})

describe('normalizeColor', () => {
  it('canonicalizes hex like normalizeHexa, but requires the #', () => {
    expect(normalizeColor('#f00')).toBe('#FF0000FF')
    expect(normalizeColor('  #ff000080 ')).toBe('#FF000080')
    expect(normalizeColor('f00')).toBeNull()
    expect(normalizeColor('#12345')).toBeNull()
  })

  it('parses rgb() with 3 args as opaque, and rgb() with 4 args like rgba()', () => {
    expect(normalizeColor('rgb(255, 0, 0)')).toBe('#FF0000FF')
    expect(normalizeColor('rgb(255, 0, 0, 0.5)')).toBe('#FF000080')
    expect(normalizeColor('rgba(255, 0, 0)')).toBe('#FF0000FF')
    expect(normalizeColor('RGBA( 11 , 3 , 0 , 0.30 )')).toBe('#0B03004D')
  })

  it('parses the space syntax with an optional / alpha', () => {
    expect(normalizeColor('rgb(11 3 0)')).toBe('#0B0300FF')
    expect(normalizeColor('rgb(11 3 0 / 0.3)')).toBe('#0B03004D')
    expect(normalizeColor('rgb(11 3 0/.3)')).toBe('#0B03004D')
  })

  it('accepts percentage channels and alpha', () => {
    expect(normalizeColor('rgb(100%, 0%, 50%)')).toBe('#FF0080FF')
    expect(normalizeColor('rgba(0, 0, 255, 50%)')).toBe('#0000FF80')
    expect(normalizeColor('rgb(11 3 0 / 30%)')).toBe('#0B03004D')
  })

  it('rounds alpha halves up and clamps out-of-range channels', () => {
    // 0.30 * 255 = 76.5: half-up gives 77 (4D); banker's rounding would give 4C.
    expect(normalizeColor('rgba(0, 0, 0, 0.30)')).toBe('#0000004D')
    expect(normalizeColor('rgba(0, 0, 0, 0.18)')).toBe('#0000002E')
    expect(normalizeColor('rgba(0, 0, 0, 0)')).toBe('#00000000')
    expect(normalizeColor('rgba(300, -5, 0, 2)')).toBe('#FF0000FF')
  })

  it('parses hsl() and hsla() in both syntaxes, with hue units', () => {
    expect(normalizeColor('hsl(120, 100%, 50%)')).toBe('#00FF00FF')
    expect(normalizeColor('hsla(240, 100%, 25%, 0.5)')).toBe('#00008080')
    expect(normalizeColor('hsl(0.5turn 100% 50% / 50%)')).toBe('#00FFFF80')
    expect(normalizeColor('hsl(-120deg 100% 50%)')).toBe('#0000FFFF')
  })

  it('parses transparent and the basic named colors, case-insensitively', () => {
    expect(normalizeColor('transparent')).toBe('#00000000')
    expect(normalizeColor('Red')).toBe('#FF0000FF')
    expect(normalizeColor('NAVY')).toBe('#000080FF')
  })

  it('rejects anything else', () => {
    expect(normalizeColor('foo')).toBeNull()
    expect(normalizeColor('orange')).toBeNull()
    expect(normalizeColor('constructor')).toBeNull()
    expect(normalizeColor('rgb(1, 2)')).toBeNull()
    expect(normalizeColor('rgb(1, 2, 3, 4, 5)')).toBeNull()
    expect(normalizeColor('rgb(1 2 3 4)')).toBeNull()
    expect(normalizeColor('rgb(1 2 3, 0.5)')).toBeNull()
    expect(normalizeColor('rgb(1, 2, 3 / 0.5)')).toBeNull()
    expect(normalizeColor('rgb(none 2 3)')).toBeNull()
    expect(normalizeColor('hsl(50%, 100%, 50%)')).toBeNull()
    expect(normalizeColor('rgb(1, 2, var(--b))')).toBeNull()
  })
})

describe('parseGradient: rgb() stops and keyword directions', () => {
  // The intro overlay in its canonical form; the next fixtures must match it.
  const INTRO = {
    type: 'linear',
    angle: 0,
    stops: [
      { color: '#0B03004D', position: 0 },
      { color: '#0B03002E', position: 45 },
      { color: '#0B030000', position: 100 }
    ]
  }

  const FIXTURES = [
    // rgba with no spaces and 2-decimal positions, as stored by the old picker.
    'linear-gradient(135deg, rgba(0,0,0,0.245) 0.00%,rgba(0,0,0,0.105) 99.00%)',
    'linear-gradient(135deg, rgba(0, 0, 0, 0.245) 0%, rgba(0, 0, 0, 0.105) 99%)',
    'linear-gradient(135deg, rgba(119,92,71,1) 0.00%,rgba(219,177,142,1) 100.00%)',
    'linear-gradient(180deg, rgba(1,1,1,0) 0.00%,rgba(1,1,1,0.6) 100.00%)',
    // Keyword direction + rgba, and its equivalents.
    'linear-gradient(to top, rgba(11,3,0,0.30) 0%, rgba(11,3,0,0.18) 45%, rgba(11,3,0,0) 100%)',
    'linear-gradient(0deg, #0B03004D 0%, #0B03002E 45%, #0B030000 100%)',
    'linear-gradient(0turn, rgb(11 3 0 / 30%) 0%, rgb(11 3 0 / 18%) 45%, rgb(11 3 0 / 0) 100%)'
  ]

  it('parses rgba stops with decimal positions', () => {
    expect(parseGradient(FIXTURES[0]!)).toEqual({
      type: 'linear',
      angle: 135,
      stops: [
        { color: '#0000003E', position: 0 },
        { color: '#0000001B', position: 99 }
      ]
    })
    expect(parseGradient(FIXTURES[1]!)).toEqual(parseGradient(FIXTURES[0]!))
    expect(parseGradient(FIXTURES[2]!)).toEqual({
      type: 'linear',
      angle: 135,
      stops: [
        { color: '#775C47FF', position: 0 },
        { color: '#DBB18EFF', position: 100 }
      ]
    })
    expect(parseGradient(FIXTURES[3]!)).toEqual({
      type: 'linear',
      angle: 180,
      stops: [
        { color: '#01010100', position: 0 },
        { color: '#01010199', position: 100 }
      ]
    })
  })

  it('gives every spelling of the intro overlay the same model', () => {
    expect(parseGradient(FIXTURES[4]!)).toEqual(INTRO)
    expect(parseGradient(FIXTURES[5]!)).toEqual(INTRO)
    expect(parseGradient(FIXTURES[6]!)).toEqual(INTRO)
  })

  it('maps every to <side> and corner, in both corner orders', () => {
    const angleOf = (direction: string) => parseGradient(`linear-gradient(${direction}, #f00, #00f)`)?.angle
    expect(angleOf('to top')).toBe(0)
    expect(angleOf('to right')).toBe(90)
    expect(angleOf('to bottom')).toBe(180)
    expect(angleOf('to left')).toBe(270)
    expect(angleOf('to top right')).toBe(45)
    expect(angleOf('to right top')).toBe(45)
    expect(angleOf('to bottom right')).toBe(135)
    expect(angleOf('to right bottom')).toBe(135)
    expect(angleOf('to bottom left')).toBe(225)
    expect(angleOf('to left bottom')).toBe(225)
    expect(angleOf('to top left')).toBe(315)
    expect(angleOf('to left top')).toBe(315)
    expect(angleOf('TO  Top   Right')).toBe(45)
  })

  it('defaults an omitted direction to 180, like CSS', () => {
    expect(parseGradient('linear-gradient(#f00, rgba(0, 0, 255, 1))')).toEqual({
      type: 'linear',
      angle: 180,
      stops: [
        { color: '#FF0000FF', position: 0 },
        { color: '#0000FFFF', position: 100 }
      ]
    })
    expect(parseGradient('linear-gradient(red 10%, blue)')?.stops[0]).toEqual({ color: '#FF0000FF', position: 10 })
  })

  it('converts rad, turn and grad to degrees, wrapped to 0-359', () => {
    const angleOf = (angle: string) => parseGradient(`linear-gradient(${angle}, #f00, #00f)`)?.angle
    expect(angleOf('0.25turn')).toBe(90)
    expect(angleOf('1.25turn')).toBe(90)
    expect(angleOf('-0.25turn')).toBe(270)
    expect(angleOf('1rad')).toBe(57)
    expect(angleOf('3.14159rad')).toBe(180)
    expect(angleOf('100grad')).toBe(90)
    expect(angleOf('450grad')).toBe(45)
    expect(angleOf('.5TURN')).toBe(180)
    expect(angleOf('0')).toBe(0)
  })

  it('applies the same angle units to conic from, and defaults it to 0', () => {
    expect(parseGradient('conic-gradient(from 0.25turn, #f00, #00f)')?.angle).toBe(90)
    expect(parseGradient('conic-gradient(from 1.5708rad, rgb(255 0 0), #00f)')?.angle).toBe(90)
    expect(parseGradient('conic-gradient(red, blue)')).toEqual({
      type: 'conic',
      angle: 0,
      stops: [
        { color: '#FF0000FF', position: 0 },
        { color: '#0000FFFF', position: 100 }
      ]
    })
  })

  it('parses rgb() stops in radial gradients', () => {
    expect(parseGradient('radial-gradient(circle at center, rgb(255, 0, 0), hsl(240 100% 50%))')?.stops).toEqual([
      { color: '#FF0000FF', position: 0 },
      { color: '#0000FFFF', position: 100 }
    ])
  })

  it('returns null, without throwing, for anything it cannot represent', () => {
    // Stored as-is on INVITO sites: an empty stop list.
    expect(parseGradient('linear-gradient(180deg, )')).toBeNull()
    expect(parseGradient('linear-gradient()')).toBeNull()
    expect(parseGradient('linear-gradient(180deg)')).toBeNull()
    expect(parseGradient('linear-gradient(90deg, foo 0%, #00f 100%)')).toBeNull()
    expect(parseGradient('linear-gradient(90deg, #f00 0px, #00f 100%)')).toBeNull()
    expect(parseGradient('linear-gradient(90deg, rgba(0,0,0,0.5) 10px, #00f)')).toBeNull()
    expect(parseGradient('linear-gradient(90deg, #f00 0% 50%, #00f)')).toBeNull()
    expect(parseGradient('linear-gradient(90deg, #f00, #00f,)')).toBeNull()
    expect(parseGradient('linear-gradient(to top bottom, #f00, #00f)')).toBeNull()
    expect(parseGradient('linear-gradient(to, #f00, #00f)')).toBeNull()
    expect(parseGradient('linear-gradient(90 deg, #f00, #00f)')).toBeNull()
    expect(parseGradient('linear-gradient(90, #f00, #00f)')).toBeNull()
    expect(parseGradient('linear-gradient(in oklab, #f00, #00f)')).toBeNull()
    expect(parseGradient('conic-gradient(at center, #f00, #00f)')).toBeNull()
    expect(parseGradient('linear-gradient(90deg, #f00, #00f), linear-gradient(0deg, #f00, #00f)')).toBeNull()
    expect(parseGradient('linear-gradient(90deg, rgb(1,2,3)), linear-gradient(0deg, rgb(4,5,6))')).toBeNull()
    expect(parseGradient('repeating-linear-gradient(90deg, #f00, #00f)')).toBeNull()
  })

  it('round-trips every fixture to a stable canonical form', () => {
    const inputs = [
      ...FIXTURES,
      'linear-gradient(to left bottom, red, hsl(120deg 100% 50% / 25%) 30%, transparent)',
      'linear-gradient(-0.25turn, rgb(100%, 0%, 50%), #00f)',
      'conic-gradient(from 100grad, rgba(255, 0, 0, 0.5), blue)',
      'radial-gradient(circle at center, rgb(0 0 0 / 50%), white)'
    ]
    for (const input of inputs) {
      const parsed = parseGradient(input)
      expect(parsed, input).not.toBeNull()
      const once = serializeGradient(parsed!)
      expect(once).not.toMatch(/rgb|hsl|\bto\b/)
      expect(parseGradient(once)).toEqual(parsed)
      expect(serializeGradient(parseGradient(once)!)).toBe(once)
    }
  })
})
