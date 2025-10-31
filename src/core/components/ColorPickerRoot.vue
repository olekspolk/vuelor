<script lang="ts">
import { createContext } from 'reka-ui'
import type { Ref } from 'vue'
import type { HSV, HSVA, HSL, RGB, RGBA, Format, ColorObject } from '../utils/types'

type ColorPickerRootContext = {
  alpha: Ref<number>,
  hsv: Ref<HSV>,
  hsva: Ref<HSVA>,
  hsl: Ref<HSL>,
  rgb: Ref<RGB>,
  rgba: Ref<RGBA>,
  hex: Ref<string>,
  hexa: Ref<string>,
  uiSlots: Function,
  disabled: Ref<boolean>,
  isAlphaEnabled: Ref<boolean>,
  emitUpdateEnd: () => void
}

export const [injectColorPickerContext, provideColorPickerContext] = createContext<ColorPickerRootContext>('ColorPickerRoot')

export interface ColorPickerRootProps {
  ui?: Record<string, any>,
  class?: string,
  styling?: 'tailwindcss' | 'vanillacss',
  disabled?: boolean,
  defaultValue?: string,
  modelValue: string | ColorObject | null,
  format?: Format
}

export type ColorPickerRootEmits = {
  (e: 'update:end', value: any): void,
  (e: 'update:modelValue', value: string | ColorObject): void
}
</script>

<script setup lang="ts">
import theme from '../theme'
import { computed, watch } from 'vue'
import { createUiSlots } from '../utils/styles'
import { useColor } from '../composables/useColor'

const props = withDefaults(defineProps<ColorPickerRootProps>(), {
  styling: 'tailwindcss',
  defaultValue: '#FFFFFFFF',
  format: 'hexa',
  disabled: false
})

const emit = defineEmits<ColorPickerRootEmits>()

const color = useColor()

watch(
  () => [color.hexa.value, color.hsv.value],
  () => emit('update:modelValue', color.toFormat(props.format))
)

watch(
  () => props.modelValue,
  (value: string | ColorObject | null) => {
    if (value === null) {
      color.hexa.value = props.defaultValue
      return
    }
    if (typeof value === 'object') {
      color.set(value)
      return
    }
    if (value !== color.hexa.value) {
      color.hexa.value = value
    }
  },
  { immediate: true }
)

const disabled = computed(() => props.disabled ?? false)
const isAlphaEnabled = computed(() => props.format.endsWith('a'))

const uiSlots = createUiSlots(theme[props.styling], props.ui)

provideColorPickerContext({
  ...color,
  uiSlots,
  disabled,
  isAlphaEnabled,
  emitUpdateEnd: () => {
    if (!props.disabled) {
      emit('update:end', color.toFormat(props.format))
    }
  }
})

const ui = uiSlots('picker');
</script>

<template>
  <div :class="ui.root(props.class)">
    <slot />
  </div>
</template>
