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
  (e: 'update:end', value: any): void,
  (e: 'update:modelValue', value: string | ColorObject): void
}
</script>

<script setup lang="ts">
import theme from '../theme'
import { computed, watch } from 'vue'
import { isColorsEqual } from '../utils/color'
import { createUiSlots } from '../utils/styles'
import { useColor } from '../composables/useColor'

const props = withDefaults(defineProps<ColorPickerRootProps>(), {
  styling: 'tailwindcss',
  defaultValue: '#B63DDAFF',
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
  (value: ModelValue, oldValue: ModelValue | undefined) => {
    if (
      (value === null) ||
      (props.format === 'object' && typeof value !== 'object') ||
      (props.format !== 'object' && typeof value === 'object')
    ) {
      // Reset to default value if input value is null or of wrong type
      color.hexa.value = props.defaultValue
    } else if (!isColorsEqual(value, oldValue)) {
      // Update internal color state if modelValue has changed from outside
      color.fromFormat(value, props.format)
    }
  },
  { immediate: true }
)

const disabled = computed(() => props.disabled ?? false)
const isAlphaEnabled = computed(() => ['hexa', 'rgba', 'hsva', 'object'].includes(props.format!))

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

defineExpose({
  color
})

const ui = uiSlots('picker')
</script>

<template>
  <div :class="ui.root(props.class)">
    <slot />
  </div>
</template>
