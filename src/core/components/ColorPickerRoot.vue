<script lang="ts">
import { createContext } from 'reka-ui'
import type { Ref } from 'vue'
import type { HSVA, Hexa, RGBA } from '../utils/types'

type ColorPickerRootContext = {
  alpha: Ref<number>,
  hsva: Ref<HSVA>
  rgba: Ref<RGBA>,
  hex: Ref<string>,
  hexa: Ref<string>,
  ui: {
    input: {
      group: string,
      field: string
    }
  }
}

export const [injectColorPickerContext, provideColorPickerContext] = createContext<ColorPickerRootContext>('ColorPickerRoot')

export interface ColorPickerRootProps {
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
  hexa,
  ui: {
    input: {
      group: 'flex gap-[1px] rounded-[5px] hover:outline-1 outline-[#e6e6e6] focus-within:outline-1 focus-within:outline-[#0d99ff]',
      field: 'w-full flex-1 bg-[#f5f5f5] first:rounded-l-[5px] last:rounded-r-[5px] px-2 h-6 focus:outline-none text-[11px]'
    }
  }
})
</script>

<template>
  <div class="bg-white rounded-[13px] p-4 flex flex-col gap-2 shadow-[var(--elevation-card)]">
    <slot />
  </div>
</template>
