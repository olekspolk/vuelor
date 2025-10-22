<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { input } from '../theme'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const props = defineProps<{
  class?: string,
  ui?: Partial<typeof input.slots>
}>()

const rootContext = injectColorPickerContext()

const ui = tv(input)({
  disabled: rootContext.disabled.value
})
</script>

<template>
  <div :class="ui.group({ class: [props.ui?.group, props.class] })">
    <input
      v-model="rootContext.hexa.value"
      type="text"
      aria-label="Hex"
      :disabled="rootContext.disabled.value"
      :class="ui.field({ class: props.ui?.field })"
    />
    <input
      v-if="rootContext.isAlphaEnabled.value"
      type="text"
      value="100%"
      aria-label="Opacity"
      :disabled="rootContext.disabled.value"
      :class="ui.field({ class: ['flex-0 w-12', props.ui?.field] })"
    />
  </div>
</template>
