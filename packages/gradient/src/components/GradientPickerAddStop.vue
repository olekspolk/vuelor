<script lang="ts">
export interface GradientPickerAddStopProps {
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

const props = defineProps<GradientPickerAddStopProps>()

const rootContext = injectGradientPickerContext()

const isDisabled = computed(() =>
  rootContext.disabled.value || !rootContext.canAddStop.value
)

function handleClick () {
  if (rootContext.addStop()) rootContext.commitValue()
}

const ui = rootContext.uiSlots('button')
</script>

<template>
  <button
    type="button"
    :aria-label="props.label ?? 'Add gradient stop'"
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
          d="M12 6a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 12 6"
        />
      </svg>
    </slot>
  </button>
</template>
