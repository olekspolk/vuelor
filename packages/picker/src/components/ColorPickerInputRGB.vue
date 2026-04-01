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
  () => rootContext.rgb.value,
  (v) => { rootContext.rgb.value = v },
  { defaultMax: 255 }
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
      <span :class="ui.label(props.ui?.label)">R</span>
      <input
        type="text"
        name="red"
        aria-label="Red"
        :disabled="rootContext.disabled.value"
        :class="ui.field(props.ui?.field)"
        :value="toDisplay('r', rootContext.rgb.value.r)"
        @blur="parseChannelValue($event, 'r')"
      />
    </div>
    <div :class="ui.item(props.ui?.item)">
      <span :class="ui.label(props.ui?.label)">G</span>
      <input
        type="text"
        name="green"
        aria-label="Green"
        :disabled="rootContext.disabled.value"
        :class="ui.field(props.ui?.field)"
        :value="toDisplay('g', rootContext.rgb.value.g)"
        @blur="parseChannelValue($event, 'g')"
      />
    </div>
    <div :class="ui.item(props.ui?.item)">
      <span :class="ui.label(props.ui?.label)">B</span>
      <input
        type="text"
        name="blue"
        aria-label="Blue"
        :disabled="rootContext.disabled.value"
        :class="ui.field(props.ui?.field)"
        :value="toDisplay('b', rootContext.rgb.value.b)"
        @blur="parseChannelValue($event, 'b')"
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
