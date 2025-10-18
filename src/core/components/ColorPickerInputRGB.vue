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
      type="text"
      aria-label="Red"
      :value="rootContext.rgba.value.r"
      :class="ui.field({ class: ['px-1', props.ui?.field] })"
    />
    <input
      type="text"
      aria-label="Green"
      :value="rootContext.rgba.value.g"
      :class="ui.field({ class: ['px-1', props.ui?.field] })"
    />
    <input
      type="text"
      aria-label="Blue"
      :value="rootContext.rgba.value.b"
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
