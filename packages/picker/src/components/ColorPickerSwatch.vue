<script lang="ts" setup>
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { injectColorPickerContext } from './ColorPickerRoot.vue'
import { parseHex } from '../utils/parsers'
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

const rgba = computed(() => parseHex(props.value))

const ui = rootContext.uiSlots('swatch')
</script>

<template>
  <Primitive
    :as="props.as"
    :style="{ backgroundColor: `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})` }"
    :class="ui.base(props.ui?.base, props.class)"
  >
    <span
      :style="{
        opacity: (1 - rgba.a),
        background: `url(${SVG_MOSAIC_URL})`
      }"
      :class="ui.alpha(props.ui?.alpha)"
    />
  </Primitive>
</template>
