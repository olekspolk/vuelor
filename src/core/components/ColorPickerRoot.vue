<script lang="ts">
import { createContext } from 'reka-ui'
import type { Ref } from 'vue'
import type { HSV, HSVA, HSL, Hexa, RGB, RGBA } from '../utils/color'

type ColorPickerRootContext = {
  alpha: Ref<number>,
  hsv: Ref<HSV>,
  hsva: Ref<HSVA>,
  hsl: Ref<HSL>,
  rgb: Ref<RGB>,
  rgba: Ref<RGBA>,
  hex: Ref<string>,
  hexa: Ref<string>
}

export const [injectColorPickerContext, provideColorPickerContext] = createContext<ColorPickerRootContext>('ColorPickerRoot')

export interface ColorPickerRootProps {
  class?: string,
  disabled?: boolean,
  modelValue: string | null,
  format?: 'hex' | 'hexa' | 'rgba' | 'hsla' | 'hsl' | 'hsva' | 'hsv'
}

export type ColorPickerRootEmits = {
  (e: 'update:modelValue', value: string): void
}
</script>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { tv } from 'tailwind-variants'
import { root } from '../theme'
import {
  toHex,
  HSLtoHSV,
  HSVtoHSL,
  HSVtoRGB,
  RGBtoHSV,
  RGBtoHex,
  HexToRGB
} from '../utils/color.ts'

const props = withDefaults(defineProps<ColorPickerRootProps>(), {
  modelValue: null,
  format: 'hex'
})

const emit = defineEmits<ColorPickerRootEmits>()

const alpha = ref<number>(100)

const hsv = ref<HSV>({ h: 0, s: 0, v: 0 })
const hsva = computed<HSVA>(() => ({ ...hsv.value, a: alpha.value / 100 }))

const rgb = computed<RGB>({
  get: () => HSVtoRGB(hsv.value),
  set: (value: RGB) => (hsv.value = RGBtoHSV(value))
})

const rgba = computed<RGBA>(() => ({ ...rgb.value, a: alpha.value / 100 }))

const hsl = computed<HSL>({
  get: () => HSVtoHSL(hsv.value),
  set: (value: HSL) => (hsv.value = HSLtoHSV(value))
});

const hex = computed<Hexa>(() => RGBtoHex(rgb.value))
const hexa = computed<Hexa>(() => hex.value + toHex(alpha.value * 255 / 100))

watch(() => hexa.value, (newVal: string) => {
  emit('update:modelValue', newVal)
})

watch(() => props.modelValue, (value: string | null) => {
  if (value !== hexa.value) {
    if (value) {
      rgb.value = HexToRGB(value)

      if (value.length === 9) {
        alpha.value = Math.round((parseInt(value.slice(7, 9), 16) / 255) * 100)
      } else {
        alpha.value = 100
      }
    }
  }
}, { immediate: true })

provideColorPickerContext({
  alpha,
  hsv,
  hsva,
  hsl,
  rgb,
  rgba,
  hex,
  hexa
})

const ui = tv(root)()
</script>

<template>
  <div :class="ui.base({ class: props.class })">
    <slot />
  </div>
</template>
