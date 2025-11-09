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

type ModelValue = string | ColorObject | null

export const [injectColorPickerContext, provideColorPickerContext] = createContext<ColorPickerRootContext>('ColorPickerRoot')

export interface ColorPickerRootProps {
  ui?: Record<string, any>,
  class?: string,
  styling?: 'tailwindcss' | 'vanillacss',
  disabled?: boolean,
  defaultValue?: string,
  modelValue: ModelValue,
  format?: Format
}

export type ColorPickerRootEmits = {
  (e: 'update:end', value: ModelValue): void,
  (e: 'update:modelValue', value: ModelValue): void
}
</script>

<script setup lang="ts">
import theme from '../theme'
import { computed, watch } from 'vue'
import { createUiSlots } from '../utils/styles'
import { useColor } from '../composables/useColor'
import { useVModel } from '../composables/useVModel'

const props = withDefaults(defineProps<ColorPickerRootProps>(), {
  styling: 'tailwindcss',
  defaultValue: '#B63DDAFF',
  format: 'hexa',
  disabled: false
})

const emit = defineEmits<ColorPickerRootEmits>()

const color = useColor()

const modelValue = useVModel<ModelValue>(props, emit, (value: ModelValue) => {
  if ((value === null) ||
    (props.format === 'object' && typeof value !== 'object') ||
    (props.format !== 'object' && typeof value === 'object')) {
    color.hexa.value = props.defaultValue
  } else {
    color.fromFormat(value, props.format)
  }
})

watch(
  () => [color.hexa.value, color.hsv.value],
  () => (modelValue.value = color.toFormat(props.format))
)

const disabled = computed(() => props.disabled)
const isAlphaEnabled = computed(() => ['hexa', 'rgba', 'hsva', 'object'].includes(props.format!))

const uiSlots = createUiSlots(theme[props.styling], props.ui)
const ui = uiSlots('picker')

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

defineExpose({
  color
})
</script>

<template>
  <div :class="ui.root(props.class)">
    <slot />
  </div>
</template>
