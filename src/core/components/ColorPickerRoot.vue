<script lang="ts">
import { createContext } from 'reka-ui'
import type { Ref } from 'vue'
import type { HSV, HSVA, HSL, RGB, RGBA } from '../utils/types'

type ColorPickerRootContext = {
  alpha: Ref<number>,
  hsv: Ref<HSV>,
  hsva: Ref<HSVA>,
  hsl: Ref<HSL>,
  rgb: Ref<RGB>,
  rgba: Ref<RGBA>,
  hex: Ref<string>,
  hexa: Ref<string>,
  update: () => void
}

export const [injectColorPickerContext, provideColorPickerContext] = createContext<ColorPickerRootContext>('ColorPickerRoot')

export interface ColorPickerRootProps {
  class?: string,
  disabled?: boolean,
  defaultValue?: string,
  modelValue: string | null,
  format?: 'hex' | 'hexa' | 'rgba' | 'hsla' | 'hsl' | 'hsva' | 'hsv'
}

export type ColorPickerRootEmits = {
  (e: 'update', value: any): void,
  (e: 'update:modelValue', value: string): void
}
</script>

<script setup lang="ts">
import { watch } from 'vue'
import { tv } from 'tailwind-variants'
import { root } from '../theme'
import { useColor } from '../composables/useColor'

const props = withDefaults(defineProps<ColorPickerRootProps>(), {
  modelValue: null,
  defaultValue: '#FFFFFFFF',
  format: 'hex'
})

const emit = defineEmits<ColorPickerRootEmits>()

const color = useColor()

watch(
  () => color.hexa.value,
  (value: string) => emit('update:modelValue', value)
)

watch(
  () => props.modelValue,
  (value: string | null) => {
    if (value !== color.hexa.value) {
      color.hexa.value = value || props.defaultValue
    }
  },
  { immediate: true }
)

provideColorPickerContext({
  ...color,
  update: () => emit('update', color)
})

const ui = tv(root)()
</script>

<template>
  <div :class="ui.base({ class: props.class })">
    <slot />
  </div>
</template>
