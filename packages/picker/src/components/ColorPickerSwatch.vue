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
    root: string
    alpha: string
  }>
}>(), {
  as: 'button'
})

const emit = defineEmits<{
  select: [value: string]
}>()

const rgba = computed(() => parseHex(props.value) || rootContext.rgba.value)

function handleSelect() {
  if (rootContext.disabled.value) return
  rootContext.hexa.value = props.value
  rootContext.commitValue()
  emit('select', props.value)
}

const ui = rootContext.uiSlots('swatch')
</script>

<template>
  <Primitive
    :as="props.as"
    :disabled="rootContext.disabled.value"
    :style="{ backgroundColor: `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})` }"
    :class="ui.root(props.ui?.root, props.class)"
    @click="handleSelect"
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
