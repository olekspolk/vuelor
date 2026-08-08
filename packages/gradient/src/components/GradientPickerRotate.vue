<script lang="ts">
export interface GradientPickerRotateProps {
  /** Degrees added per activation. */
  degrees?: number,
  label?: string,
  class?: string,
  ui?: Partial<{
    root: string
  }>
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { injectGradientPickerContext } from './GradientPickerRoot.vue'

const props = withDefaults(defineProps<GradientPickerRotateProps>(), {
  degrees: 90
})

const rootContext = injectGradientPickerContext()

// The radial serializer has no angle, so rotating is meaningless there.
const isDisabled = computed(() =>
  rootContext.disabled.value || rootContext.type.value === 'radial'
)

function handleClick () {
  rootContext.rotate(props.degrees)
  rootContext.commitValue()
}

const ui = rootContext.uiSlots('button')
</script>

<template>
  <button
    type="button"
    :aria-label="props.label ?? `Rotate gradient ${props.degrees} degrees`"
    :disabled="isDisabled"
    :class="ui.root(props.ui?.root, props.class)"
    @click="handleClick"
  >
    <slot>
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M10.233 6.474a2.5 2.5 0 0 1 3.535 0L15.293 8H14a.5.5 0 0 0 0 1h2.5a.5.5 0 0 0 .5-.5V6a.5.5 0 1 0-1 0v1.292l-1.525-1.525a3.5 3.5 0 0 0-4.95 0L7.147 8.146a.5.5 0 0 0 .707.707zm2.828 3.172a1.5 1.5 0 0 0-2.121 0l-3.293 3.293a1.5 1.5 0 0 0 0 2.121l3.293 3.293a1.5 1.5 0 0 0 2.12 0l3.294-3.293a1.5 1.5 0 0 0 0-2.121zm-1.414.707a.5.5 0 0 1 .707 0l3.293 3.293a.5.5 0 0 1 0 .707l-3.293 3.293a.5.5 0 0 1-.707 0l-3.293-3.293a.5.5 0 0 1 0-.707z"
        />
      </svg>
    </slot>
  </button>
</template>
