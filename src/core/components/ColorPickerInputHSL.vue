<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { input } from '../theme'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const props = defineProps<{
  class?: string,
  ui?: Partial<typeof input.slots>
}>()

const rootContext = injectColorPickerContext()

const ui = tv(input)()
</script>

<template>
  <div :class="ui.group({ class: [props.ui?.group, props.class] })">
    <input
      v-model="rootContext.hsva.value.h"
      type="text"
      aria-label="Hue"
      :class="ui.field({ class: ['px-1', props.ui?.field] })"
    />
    <input
      type="text"
      aria-label="Saturation"
      :value="rootContext.hsva.value.s.toFixed(2)"
      :class="ui.field({ class: ['px-1', props.ui?.field] })"
    />
    <input
      type="text"
      aria-label="Lightness"
      :value="rootContext.hsva.value.v.toFixed(2)"
      :class="ui.field({ class: ['px-1', props.ui?.field] })"
    />
    <input
      type="text"
      aria-label="Alpha"
      :value="rootContext.alpha.value"
      :class="ui.field({ class: ['flex-0 w-12', props.ui?.field] })"
    />
  </div>
</template>

<style scoped></style>
