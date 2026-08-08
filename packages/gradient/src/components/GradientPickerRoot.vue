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
  /**
   * Read once at mount; never below 2, the CSS gradient minimum. Bounds the
   * remove-stop interaction only — a parsed modelValue keeps however many
   * stops it declares.
   */
  minStops?: number,
  /** Read once at mount; bounds the add-stop interaction only. */
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

function warnUnsupported (prop: 'modelValue' | 'defaultValue', value: string): void {
  // process.env.NODE_ENV survives the library build (vite keeps it verbatim in
  // lib mode), so the consumer's own bundler decides dev vs prod — unlike
  // import.meta.env.DEV, which the lib build resolves to false at package
  // build time and strips for everyone.
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[GradientPickerRoot] Unsupported ${prop} "${value}". Accepted: linear/radial/conic ` +
      'gradients with #hex stops, e.g. "linear-gradient(90deg, #FF0000FF 0%, #0000FFFF 100%)".'
    )
  }
}

// valueCommit marks the END of a user interaction, so identical re-commits
// (Enter then blur on an input, a drag ending where it started) deduplicate
// against the last committed value. A parent write resets the baseline: a
// later interaction landing back on a previously committed value must still
// commit relative to what the parent last set.
let lastCommittedValue: ModelValue = null

const modelValue = useVModel<ModelValue>(props, emit, (value: ModelValue) => {
  if (value === null) {
    if (!gradient.setFromCSS(props.defaultValue)) {
      warnUnsupported('defaultValue', props.defaultValue)
    }
  } else if (!gradient.setFromCSS(value)) {
    // Keep the current editor state: resetting on a bad value would throw
    // away the user's stops mid-edit.
    warnUnsupported('modelValue', value)
  }
  lastCommittedValue = gradient.css.value
})

// No immediate flush: emitting during setup would overwrite the parent's
// value with our defaults before it was parsed.
watch(gradient.css, (value) => (modelValue.value = value))

const disabled = computed(() => props.disabled)

const uiSlots = createUiSlots(theme.tailwindcss, props.ui, props.styling, gradientVanillaClass)
const ui = uiSlots('root')

function commitValue (): void {
  if (props.disabled) return
  const value = gradient.css.value
  if (value === lastCommittedValue) return
  lastCommittedValue = value
  emit('valueCommit', value)
}

provideGradientPickerContext({
  ...gradient,
  uiSlots,
  disabled,
  commitValue
})

defineExpose({
  gradient,
  commitValue
})
</script>

<template>
  <div :class="ui.root(props.class)">
    <slot
      :gradient="gradient"
      :commitValue="commitValue"
    />
  </div>
</template>
