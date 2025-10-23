<script setup lang="ts">
import type { UiInputSlots } from '../utils/styles'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const props = defineProps<{
  class?: string,
  ui?: Partial<UiInputSlots>
}>()

const rootContext = injectColorPickerContext()

const ui = rootContext.uiSlots('input')
</script>

<template>
  <div :class="ui.group(props.ui?.group, props.class)">
    <input
      v-model="rootContext.hexa.value"
      type="text"
      aria-label="Hex"
      :disabled="rootContext.disabled.value"
      :class="ui.field(props.ui?.field)"
    />
    <input
      v-if="rootContext.isAlphaEnabled.value"
      type="text"
      value="100%"
      aria-label="Opacity"
      :disabled="rootContext.disabled.value"
      :class="ui.field('flex-0 w-12', props.ui?.field)"
    />
  </div>
</template>
