<script lang="ts">
export interface GradientPickerReverseProps {
  label?: string,
  class?: string,
  ui?: Partial<{
    root: string
  }>
}
</script>

<script setup lang="ts">
import { injectGradientPickerContext } from './GradientPickerRoot.vue'

const props = defineProps<GradientPickerReverseProps>()

const rootContext = injectGradientPickerContext()

function handleClick () {
  rootContext.reverse()
  rootContext.commitValue()
}

const ui = rootContext.uiSlots('button')
</script>

<template>
  <button
    type="button"
    :aria-label="props.label ?? 'Reverse gradient'"
    :disabled="rootContext.disabled.value"
    :class="ui.root(props.ui?.root, props.class)"
    @click="handleClick"
  >
    <slot>
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M8.354 6.354a.5.5 0 1 0-.708-.708l-2.5 2.5a.5.5 0 0 0 0 .708l2.5 2.5a.5.5 0 0 0 .708-.708L6.707 9H18.5a.5.5 0 0 0 0-1H6.707zm7.292 7a.5.5 0 0 1 .708-.708l2.5 2.5a.5.5 0 0 1 0 .708l-2.5 2.5a.5.5 0 0 1-.708-.708L17.293 16H5.5a.5.5 0 0 1 0-1h11.793z"
        />
      </svg>
    </slot>
  </button>
</template>
