<script setup lang="ts">
import type { UiInputSlots } from '../utils/styles'
import { injectColorPickerContext } from './ColorPickerRoot.vue'
import { useChannelInput } from '../composables/useChannelInput.ts'

const props = defineProps<{
  class?: string,
  ui?: Partial<UiInputSlots>
}>()

const rootContext = injectColorPickerContext()

const { parseChannelValue, handleAlphaInput, toDisplay } = useChannelInput(
  () => rootContext.hsv.value,
  (v) => { rootContext.hsv.value = v },
  { hueChannel: 'h' }
)

const ui = rootContext.uiSlots('input')
</script>

<template>
  <div
    :class="ui.group(props.ui?.group, props.class)"
    :data-disabled="rootContext.disabled.value ? '' : null"
  >
    <div :class="ui.item(props.ui?.item)">
      <slot name="before" />
      <span :class="ui.label(props.ui?.label)">H</span>
      <input
        type="text"
        name="hue"
        aria-label="Hue"
        :disabled="rootContext.disabled.value"
        :class="ui.field(props.ui?.field)"
        :value="toDisplay('h', rootContext.hsv.value.h)"
        @blur="parseChannelValue($event, 'h', 360)"
      />
    </div>
    <div :class="ui.item(props.ui?.item)">
      <span :class="ui.label(props.ui?.label)">S</span>
      <input
        type="text"
        name="saturation"
        aria-label="Saturation"
        :disabled="rootContext.disabled.value"
        :class="ui.field(props.ui?.field)"
        :value="toDisplay('s', rootContext.hsv.value.s)"
        @blur="parseChannelValue($event, 's')"
      />
    </div>
    <div :class="ui.item(props.ui?.item)">
      <span :class="ui.label(props.ui?.label)">B</span>
      <input
        type="text"
        name="brightness"
        aria-label="Brightness"
        :disabled="rootContext.disabled.value"
        :class="ui.field(props.ui?.field)"
        :value="toDisplay('v', rootContext.hsv.value.v)"
        @blur="parseChannelValue($event, 'v')"
      />
    </div>
    <div
      v-if="rootContext.isAlphaEnabled.value"
      data-alpha-input
      :class="ui.item(props.ui?.item)"
    >
      <input
        type="text"
        name="opacity"
        aria-label="Opacity"
        :value="rootContext.alpha.value"
        :disabled="rootContext.disabled.value"
        :class="ui.field(props.ui?.field)"
        @blur="handleAlphaInput"
      />
      <span data-alpha-label :class="ui.label(props.ui?.label)">%</span>
    </div>
  </div>
</template>
