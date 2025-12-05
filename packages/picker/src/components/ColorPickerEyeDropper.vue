<script lang="ts" setup>
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

interface Props {
  class?: string,
  as?: string,
  asChild?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button'
})

const rootContext = injectColorPickerContext()

const isSupported = computed(() => {
  return typeof window !== 'undefined' && !!(window as any).EyeDropper
})

function openEyeDropper () {
  const EyeDropperCtor = (window as any).EyeDropper
  const eyeDropper = new EyeDropperCtor()

  eyeDropper
    .open()
    .then((result: { sRGBHex: string }) => {
      rootContext.hexa.value = result.sRGBHex
    })
    .catch((e: any) => {
      console.error(e)
    })
}

const ui = rootContext.uiSlots('dropper')
</script>

<template>
  <Primitive
    v-if="isSupported"
    :as="props.as"
    :as-child="props.asChild"
    :disabled="rootContext.disabled.value"
    :class="ui.base(props.class)"
    @click="openEyeDropper"
  >
    <slot />
  </Primitive>
</template>
