<script lang="ts">
import { createContext } from 'reka-ui'
import type { Ref } from 'vue'
import type { HSV, HSVA, HSL, RGB, RGBA } from '../utils/types'

type ColorPickerRootContext = {
  alpha: Ref<number>,
  hsv: Ref<HSV>,
  hsva: Ref<HSVA>,
  hsl: Ref<HSL>,
  rgb: Ref<RGB>,
  rgba: Ref<RGBA>,
  hex: Ref<string>,
  hexa: Ref<string>,
  emitUpdateEnd: () => void
}

export const [injectColorPickerContext, provideColorPickerContext] = createContext<ColorPickerRootContext>('ColorPickerRoot')

export interface ColorPickerRootProps {
  class?: string,
  disabled?: boolean,
  defaultValue?: string,
  modelValue: string | null,
  format?: 'hex' | 'hexa' | 'rgb' | 'rgba' | 'hsl' | 'hsla'
}

export type ColorPickerRootEmits = {
  (e: 'update', value: any): void,
  (e: 'update:end', value: any): void,
  (e: 'update:modelValue', value: string): void
}
</script>

<script setup lang="ts">
import { computed, watch, toRaw } from 'vue'
import { tv } from 'tailwind-variants'
import { root } from '../theme'
import { useColor } from '../composables/useColor'

const props = withDefaults(defineProps<ColorPickerRootProps>(), {
  modelValue: null,
  defaultValue: '#FFFFFFFF',
  format: 'hex'
})

const emit = defineEmits<ColorPickerRootEmits>()

const color = useColor()

const state = computed(() => ({
  rgb: toRaw(color.rgb.value),
  rgba: toRaw(color.rgba.value),
  hsl: toRaw(color.hsl.value),
  hsla: toRaw(color.hsla.value),
  hex: color.hex.value,
  hexa: color.hexa.value
}));

watch(() => state.value, (value) => emit('update', value))

watch(
  () => color.hexa.value,
  (value: string) => emit('update:modelValue', value)
)

watch(
  () => props.modelValue,
  (value: string | null) => {
    if (value !== color.hexa.value) {
      color.hexa.value = value || props.defaultValue
    }
  },
  { immediate: true }
)

provideColorPickerContext({
  ...color,
  emitUpdateEnd: () => emit('update:end', state.value)
})

const ui = tv(root)()
</script>

<template>
  <div :class="ui.base({ class: props.class })">
    <slot />
  </div>
</template>
