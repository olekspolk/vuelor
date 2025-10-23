<script lang="ts" setup>
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const props = defineProps<{
  class?: string
}>()

const rootContext = injectColorPickerContext()

function openEyeDropper () {
  if (typeof window === 'undefined' || !(window as any).EyeDropper) {
    console.warn('EyeDropper API is not available in this environment.')
    return
  }

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
  <button
    :class="ui.base(props.class)"
    @click="openEyeDropper"
  >
    <slot />
  </button>
</template>
