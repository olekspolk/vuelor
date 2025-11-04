import { ref, toRaw, computed } from 'vue'
import type { HSV, HSVA, HSL, HSLA, Hexa, RGB, RGBA, Format, ColorObject } from '../utils/types'
import { toHex, HSLtoHSV, HSVtoHSL, HSVtoRGB, RGBtoHSV, RGBtoHex, HexToRGB } from '../utils/color.ts'
import { parseHex, parseRGB, parseRGBA, parseHSL, parseHSLA, parseHSV, parseHSVA } from '../utils/parsers.ts'

type ColorState = {
  hsv: HSV
  hsl: HSL
  rgb: RGB
}

function fromRGB (rgb: RGB): ColorState {
  const hsv = RGBtoHSV(rgb)
  const hsl = HSVtoHSL(hsv)
  return { hsv, hsl, rgb }
}

function fromHSL (hsl: HSL): ColorState {
  const hsv = HSLtoHSV(hsl)
  const rgb = HSVtoRGB(hsv)
  return { hsv, hsl, rgb }
}

function fromHSV (hsv: HSV): ColorState {
  const hsl = HSVtoHSL(hsv)
  const rgb = HSVtoRGB(hsv)
  return { hsv, hsl, rgb }
}

export function useColor () {
  const state = ref<ColorState>({
    hsv: { h: 0, s: 0, v: 0 } as HSV,
    hsl: { h: 0, s: 0, l: 0 } as HSL,
    rgb: { r: 0, g: 0, b: 0 } as RGB,
  })

  const alpha = ref(100)

  const rgb = computed<RGB>({
    get: () => state.value.rgb,
    set: (value) => (state.value = fromRGB(value))
  })

  const rgba = computed<RGBA>({
    get: () => ({ ...state.value.rgb, a: alpha.value / 100 }),
    set: (value) => {
      alpha.value = (value.a ?? 1) * 100
      state.value = fromRGB({ r: value.r, g: value.g, b: value.b })
    }
  })

  const hsl = computed<HSL>({
    get: () => state.value.hsl,
    set: (value) => (state.value = fromHSL(value))
  })

  const hsla = computed<HSLA>({
    get: () => ({ ...state.value.hsl, a: alpha.value / 100 }),
    set: (value) => {
      alpha.value = (value.a ?? 1) * 100
      state.value = fromHSL({ h: value.h, s: value.s, l: value.l })
    }
  })

  const hsv = computed<HSV>({
    get: () => state.value.hsv,
    set: (value) => (state.value = fromHSV(value))
  })

  const hsva = computed<HSVA>({
    get: () => ({ ...state.value.hsv, a: alpha.value / 100 }),
    set: (value) => {
      alpha.value = (value.a ?? 1) * 100
      state.value = fromHSV({ h: value.h, s: value.s, v: value.v })
    }
  })

  const hex = computed<Hexa>({
    get: () => RGBtoHex(state.value.rgb),
    set: (value) => {
      const rgb = HexToRGB(value)
      state.value = fromRGB(rgb)
    }
  })

  const hexa = computed<Hexa>({
    get: () => {
      const hex = RGBtoHex(state.value.rgb)
      const a = toHex(alpha.value / 100 * 255)
      return hex + a
    },
    set: (value) => {
      const rgb = HexToRGB(value.slice(0, 7))
      const aHex = value.slice(7, 9)
      const a = aHex ? parseInt(aHex, 16) / 255 : 1
      alpha.value = a * 100
      state.value = fromRGB(rgb)
    }
  })

  function toRGBString(): string {
    const { r, g, b } = state.value.rgb
    return `rgb(${r}, ${g}, ${b})`
  }

  function toRGBAString(): string {
    const { r, g, b } = state.value.rgb
    const a = (alpha.value / 100).toFixed(2)
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }

  function toHSLString(): string {
    const { h, s, l } = state.value.hsl
    const sPerc = (s * 100).toFixed(1)
    const lPerc = (l * 100).toFixed(1)
    return `hsl(${h}, ${sPerc}%, ${lPerc}%)`
  }

  function toHSLAString(): string {
    const { h, s, l } = state.value.hsl
    const sPerc = (s * 100).toFixed(1)
    const lPerc = (l * 100).toFixed(1)
    const a = (alpha.value / 100).toFixed(2)
    return `hsla(${h}, ${sPerc}%, ${lPerc}%, ${a})`
  }

  function toHSVString(): string {
    const { h, s, v } = state.value.hsv
    const sPerc = (s * 100).toFixed(1)
    const vPerc = (v * 100).toFixed(1)
    return `hsv(${h}, ${sPerc}%, ${vPerc}%)`
  }

  function toHSVAString(): string {
    const { h, s, v } = state.value.hsv
    const sPerc = (s * 100).toFixed(1)
    const vPerc = (v * 100).toFixed(1)
    const a = (alpha.value / 100).toFixed(2)
    return `hsva(${h}, ${sPerc}%, ${vPerc}%, ${a})`
  }

  function toObject(): ColorObject {
    return {
      rgb: toRaw(rgb.value),
      rgba: toRaw(rgba.value),
      hsl: toRaw(hsl.value),
      hsla: toRaw(hsla.value),
      hsv: toRaw(hsv.value),
      hsva: toRaw(hsva.value),
      hex: hex.value,
      hexa: hexa.value
    }
  }

  function toFormat(format: Format): string | ColorObject {
    switch (format) {
      case 'hex':
        return hex.value
      case 'hexa':
        return hexa.value
      case 'rgb':
        return toRGBString()
      case 'rgba':
        return toRGBAString()
      case 'hsl':
        return toHSLString()
      case 'hsla':
        return toHSLAString()
      case 'hsv':
        return toHSVString()
      case 'hsva':
        return toHSVAString()
      case 'object':
        return toObject()
      default:
        return hex.value
    }
  }

  function fromFormat(value: string | ColorObject, format: Format) {
    switch (format) {
      case 'hex': {
        rgba.value = parseHex(value as string)
        break
      }
      case 'hexa': {
        rgba.value = parseHex(value as string)
        break
      }
      case 'rgb': {
        rgb.value = parseRGB(value as string)
        break
      }
      case 'rgba': {
        rgba.value = parseRGBA(value as string)
        break
      }
      case 'hsl': {
        hsl.value = parseHSL(value as string)
        break
      }
      case 'hsla': {
        hsla.value = parseHSLA(value as string)
        break
      }
      case 'hsv': {
        hsv.value = parseHSV(value as string)
        break
      }
      case 'hsva': {
        hsva.value = parseHSVA(value as string)
        break
      }
      case 'object': {
        state.value = {
          hsv: (value as ColorObject).hsv,
          hsl: (value as ColorObject).hsl,
          rgb: (value as ColorObject).rgb
        }
        alpha.value = ((value as ColorObject).hsva.a ?? 1) * 100
        break
      }
    }
  }

  return {
    state,
    alpha,
    rgb,
    rgba,
    hsl,
    hsla,
    hsv,
    hsva,
    hex,
    hexa,
    toRGBString,
    toRGBAString,
    toHSLString,
    toHSLAString,
    toHSVString,
    toHSVAString,
    toObject,
    toFormat,
    fromFormat
  }
}
