<script lang="ts">
import { createContext } from 'reka-ui'
import type { Ref } from 'vue'
import type { ThemeSlots } from '../theme/index.ts'
import type { HSV, HSVA, HSL, RGB, RGBA, Format, ColorObject } from '../utils/types.ts'

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
  commitValue: () => void
}

type ModelValue = string | ColorObject | null

export const [injectColorPickerContext, provideColorPickerContext] = createContext<ColorPickerRootContext>('ColorPickerRoot')

export interface ColorPickerRootProps {
  ui?: ThemeSlots,
  class?: string,
  styling?: 'tailwindcss' | 'vanillacss' | 'unstyled',
  disabled?: boolean,
  defaultValue?: string,
  // Optional: withDefaults falls back to null when a consumer omits it, so
  // uncontrolled usage (e.g. <ColorPickerRoot /> with no v-model) doesn't warn.
  modelValue?: ModelValue,
  format?: Format
}

export type ColorPickerRootEmits = {
  (e: 'valueCommit', value: ModelValue): void,
  (e: 'update:modelValue', value: ModelValue): void
}
</script>

<script setup lang="ts">
import theme from '../theme/index.ts'
import { computed, watch } from 'vue'
import { createUiSlots } from '../utils/styles.ts'
import { useColor } from '../composables/useColor.ts'
import { useVModel } from '../composables/useVModel.ts'

const props = withDefaults(defineProps<ColorPickerRootProps>(), {
  styling: 'tailwindcss',
  defaultValue: '#B63DDAFF',
  modelValue: null,
  format: 'hexa',
  disabled: false
})

const emit = defineEmits<ColorPickerRootEmits>()

const color = useColor()

const modelValue = useVModel<ModelValue>(props, emit, (value: ModelValue) => {
  const objectMismatch = props.format === 'object' && typeof value !== 'object'
  const stringMismatch = props.format !== 'object' && typeof value === 'object'

  if (value === null) {
    color.hexa.value = props.defaultValue
  } else if (objectMismatch || stringMismatch) {
    // process.env.NODE_ENV survives the library build (vite keeps it verbatim
    // in lib mode), so the warning reaches consumers' dev builds — unlike
    // import.meta.env.DEV, which the lib build strips for everyone.
    if (process.env.NODE_ENV !== 'production') {
      const received = typeof value
      const expected = props.format === 'object' ? 'object' : 'string'
      console.warn(
        `[ColorPickerRoot] modelValue type mismatch: format="${props.format}" expects a ${expected} but received ${received}. ` +
        `Falling back to defaultValue "${props.defaultValue}".`
      )
    }
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

const uiSlots = createUiSlots(theme.tailwindcss, props.ui, props.styling)
const ui = uiSlots('picker')

provideColorPickerContext({
  ...color,
  uiSlots,
  disabled,
  isAlphaEnabled,
  commitValue: () => {
    if (!props.disabled) {
      emit('valueCommit', color.toFormat(props.format))
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
