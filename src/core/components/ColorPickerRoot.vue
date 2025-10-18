<script lang="ts">
import { tv } from 'tailwind-variants'
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
import { RGBAtoHex, toHex, HSVAtoRGBA } from '../utils/utils'

const props = withDefaults(defineProps<ColorPickerRootProps>(), {
  modelValue: null,
  format: 'hex'
})

const emit = defineEmits<ColorPickerRootEmits>()

const hsva = ref<HSVA>({
  h: 0,
  s: 1,
  v: 1,
  a: 0.5
})

const alpha = ref<number>(100)

const rgba = computed<RGBA>(() => HSVAtoRGBA(hsva.value))
const hex = computed<Hexa>(() => RGBAtoHex(rgba.value))
const hexa = computed<Hexa>(() => hex.value + toHex(alpha.value * 255 / 100))

watch(() => hexa.value, (newVal: string) => {
  emit('update:modelValue', newVal)
})

provideColorPickerContext({
  alpha,
  hsva,
  rgba,
  hex,
  hexa
})

const ui = tv({
  slots: {
    base: 'bg-white rounded-[13px] p-4 flex flex-col gap-2 shadow-[var(--elevation-card)]'
  }
})()
</script>

<template>
  <div :class="ui.base({ class: props.class })">
    <slot />
  </div>
</template>
