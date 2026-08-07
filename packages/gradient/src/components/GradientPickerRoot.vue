<script lang="ts">
import { createContext } from 'reka-ui'
import type { Ref } from 'vue'
import type { GradientThemeSlots } from '../theme/index.ts'
import type { UseGradientReturn } from '../composables/useGradient.ts'

export type GradientPickerRootContext = UseGradientReturn & {
  uiSlots: Function,
  disabled: Ref<boolean>,
  commitValue: () => void
}

type ModelValue = string | null

export const [injectGradientPickerContext, provideGradientPickerContext] = createContext<GradientPickerRootContext>('GradientPickerRoot')

export interface GradientPickerRootProps {
  ui?: GradientThemeSlots,
  class?: string,
  styling?: 'tailwindcss' | 'vanillacss' | 'unstyled',
  disabled?: boolean,
  /** Applied when modelValue is null/absent, mirroring ColorPickerRoot. */
  defaultValue?: string,
  modelValue?: ModelValue,
  /** Read once at mount; never below 2, the CSS gradient minimum. */
  minStops?: number,
  /** Read once at mount. */
  maxStops?: number
}

export type GradientPickerRootEmits = {
  (e: 'valueCommit', value: ModelValue): void,
  (e: 'update:modelValue', value: ModelValue): void
}
</script>

<script setup lang="ts">
import theme, { gradientVanillaClass } from '../theme/index.ts'
import { computed, watch } from 'vue'
import { createUiSlots, useVModel } from '@vuelor/picker'
import { useGradient } from '../composables/useGradient.ts'

const props = withDefaults(defineProps<GradientPickerRootProps>(), {
  styling: 'tailwindcss',
  defaultValue: 'linear-gradient(90deg, #FF98C2FF 0%, #FFFA7AFF 100%)',
  modelValue: null,
  disabled: false,
  minStops: 2,
  maxStops: 8
})

const emit = defineEmits<GradientPickerRootEmits>()

const gradient = useGradient({ minStops: props.minStops, maxStops: props.maxStops })

function warnUnsupported (value: string): void {
  // process.env.NODE_ENV survives the library build (vite keeps it verbatim in
  // lib mode), so the consumer's own bundler decides dev vs prod — unlike
  // import.meta.env.DEV, which the lib build resolves to false at package
  // build time and strips for everyone.
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[GradientPickerRoot] Unsupported modelValue "${value}". Accepted: linear/radial/conic ` +
      'gradients with #hex stops, e.g. "linear-gradient(90deg, #FF0000FF 0%, #0000FFFF 100%)".'
    )
  }
}

const modelValue = useVModel<ModelValue>(props, emit, (value: ModelValue) => {
  if (value === null) {
    gradient.setFromCSS(props.defaultValue)
  } else if (!gradient.setFromCSS(value)) {
    // Keep the current editor state: resetting on a bad value would throw
    // away the user's stops mid-edit.
    warnUnsupported(value)
  }
})

// No immediate flush: emitting during setup would overwrite the parent's
// value with our defaults before it was parsed.
watch(gradient.css, (value) => (modelValue.value = value))

const disabled = computed(() => props.disabled)

const uiSlots = createUiSlots(theme.tailwindcss, props.ui, props.styling, gradientVanillaClass)
const ui = uiSlots('root')

provideGradientPickerContext({
  ...gradient,
  uiSlots,
  disabled,
  commitValue: () => {
    if (!props.disabled) {
      emit('valueCommit', gradient.css.value)
    }
  }
})

defineExpose({
  gradient
})
</script>

<template>
  <div :class="ui.root(props.class)">
    <slot :gradient="gradient" />
  </div>
</template>
