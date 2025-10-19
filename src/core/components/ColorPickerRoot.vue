<script lang="ts">
import { createContext } from 'reka-ui'
import type { Ref } from 'vue'
import type { HSVA, Hexa, RGBA } from '../utils/types'

type ColorPickerRootContext = {
  alpha: Ref<number>,
  hsva: Ref<HSVA>
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
  RGBAtoHex,
  RGBAtoHSVA,
  HexToRGBA,
  HSVAtoRGBA
} from '../utils/utils'

const props = withDefaults(defineProps<ColorPickerRootProps>(), {
  modelValue: null,
  format: 'hex'
})

const emit = defineEmits<ColorPickerRootEmits>()

const hsva = ref<HSVA>({
  h: 0,
  s: 0,
  v: 0,
  a: 0
})

const alpha = ref<number>(100)

const rgba = computed<RGBA>({
  get: () => HSVAtoRGBA(hsva.value),
  set: (value: RGBA) => (hsva.value = RGBAtoHSVA(value))
})

const hex = computed<Hexa>(() => RGBAtoHex(rgba.value))
const hexa = computed<Hexa>(() => hex.value + toHex(alpha.value * 255 / 100))

watch(() => hexa.value, (newVal: string) => {
  emit('update:modelValue', newVal)
})

watch(() => props.modelValue, (value: string | null) => {
  if (value !== hexa.value) {
    if (value) {
      const rgbaValue = HexToRGBA(value)
      rgba.value = rgbaValue

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
  // hsv
  hsva,
  // rgb
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
