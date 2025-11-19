<script lang="ts" setup>
import { Primitive } from 'reka-ui'
import { injectColorPickerContext } from './ColorPickerRoot.vue'
import { SVG_MOSAIC_URL } from '../utils/consts'

const rootContext = injectColorPickerContext()

const props = withDefaults(defineProps<{
  as?: string,
  value: string,
  class?: string,
  ui?: Partial<{
    base: string
    alpha: string
  }>
}>(), {
  as: 'button'
})

const ui = rootContext.uiSlots('swatch')
</script>

<template>
  <Primitive
    :as="props.as"
    :style="{ backgroundColor: props.value }"
    :class="ui.base(props.ui?.base, props.class)"
  >
    <span
      :style="{
        opacity: 0.85,
        background: `url(${SVG_MOSAIC_URL})`
      }"
      :class="ui.alpha(props.ui?.alpha)"
    />
  </Primitive>
</template>
