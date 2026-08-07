<script lang="ts">
export interface GradientPickerPreviewProps {
  as?: string,
  /** Render the flat left-to-right stop strip instead of the real gradient. */
  track?: boolean,
  class?: string,
  ui?: Partial<{
    root: string
  }>
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { injectGradientPickerContext } from './GradientPickerRoot.vue'

const props = withDefaults(defineProps<GradientPickerPreviewProps>(), {
  as: 'div',
  track: false
})

const rootContext = injectGradientPickerContext()

const ui = rootContext.uiSlots('preview')
</script>

<template>
  <Primitive
    :as="props.as"
    :style="{ background: props.track ? rootContext.trackCSS.value : rootContext.css.value }"
    :class="ui.root(props.ui?.root, props.class)"
  >
    <slot />
  </Primitive>
</template>
