<script lang="ts">
export interface GradientPickerRemoveStopProps {
  /** Stop to remove; defaults to the selected stop. */
  stopId?: number,
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

const props = defineProps<GradientPickerRemoveStopProps>()

const rootContext = injectGradientPickerContext()

const isDisabled = computed(() =>
  rootContext.disabled.value || !rootContext.canRemoveStop.value
)

function handleClick () {
  if (rootContext.removeStop(props.stopId)) rootContext.commitValue()
}

const ui = rootContext.uiSlots('button')
</script>

<template>
  <button
    type="button"
    :aria-label="props.label ?? 'Remove gradient stop'"
    :disabled="isDisabled"
    :class="ui.root(props.ui?.root, props.class)"
    @click="handleClick"
  >
    <slot>
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6 12a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 6 12"
        />
      </svg>
    </slot>
  </button>
</template>
