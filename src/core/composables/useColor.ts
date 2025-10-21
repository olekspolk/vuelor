import { ref, computed } from 'vue'
import type { HSV, HSVA, HSL, Hexa, RGB, RGBA } from '../utils/types'
import { toHex, HSLtoHSV, HSVtoHSL, HSVtoRGB, RGBtoHSV, RGBtoHex, HexToRGB } from '../utils/color.ts'

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
  const color = ref<ColorState>({
    hsv: { h: 0, s: 0, v: 0 } as HSV,
    hsl: { h: 0, s: 0, l: 0 } as HSL,
    rgb: { r: 0, g: 0, b: 0 } as RGB,
  })

  const alpha = ref(100)

  const rgb = computed<RGB>({
    get: () => color.value.rgb,
    set: (value) => (color.value = fromRGB(value))
  })

  const rgba = computed<RGBA>({
    get: () => ({ ...color.value.rgb, a: alpha.value / 100 }),
    set: (value) => {
      alpha.value = (value.a ?? 1) * 100
      color.value = fromRGB({ r: value.r, g: value.g, b: value.b })
    }
  })

  const hsl = computed<HSL>({
    get: () => color.value.hsl,
    set: (value) => (color.value = fromHSL(value))
  })

  const hsla = computed<HSVA>({
    get: () => ({ ...color.value.hsv, a: alpha.value / 100 }),
    set: (value) => {
      alpha.value = (value.a ?? 1) * 100
      color.value = fromHSV({ h: value.h, s: value.s, v: value.v })
    }
  })

  const hsv = computed<HSV>({
    get: () => color.value.hsv,
    set: (value) => (color.value = fromHSV(value))
  })

  const hsva = computed<HSVA>({
    get: () => ({ ...color.value.hsv, a: alpha.value / 100 }),
    set: (value) => {
      alpha.value = (value.a ?? 1) * 100
      color.value = fromHSV({ h: value.h, s: value.s, v: value.v })
    }
  })

  const hex = computed<Hexa>({
    get: () => RGBtoHex(color.value.rgb),
    set: (value) => {
      const rgb = HexToRGB(value)
      color.value = fromRGB(rgb)
    }
  })

  const hexa = computed<Hexa>({
    get: () => {
      const hex = RGBtoHex(color.value.rgb)
      const a = toHex(alpha.value / 100 * 255)
      return hex + a
    },
    set: (value) => {
      const rgb = HexToRGB(value.slice(0, 7))
      const aHex = value.slice(7, 9)
      const a = aHex ? parseInt(aHex, 16) / 255 : 1
      alpha.value = a * 100
      color.value = fromRGB(rgb)
    }
  })

  return {
    alpha,
    rgb,
    rgba,
    hsl,
    hsla,
    hsv,
    hsva,
    hex,
    hexa
  }
}
