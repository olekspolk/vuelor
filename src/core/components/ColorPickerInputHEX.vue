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
      v-model="rootContext.hexa.value"
      type="text"
      aria-label="Hex"
      :class="ui.field({ class: props.ui?.field })"
    />
    <input
      type="text"
      value="100%"
      aria-label="Opacity"
      :class="ui.field({ class: ['flex-0 w-12', props.ui?.field] })"
    />
  </div>
</template>
