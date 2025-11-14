<script lang="ts" setup>
import { computed } from 'vue'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const props = defineProps<{
  class?: string
}>()

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
  <button
    v-if="isSupported"
    :disabled="rootContext.disabled.value"
    :class="ui.base(props.class)"
    @click="openEyeDropper"
  >
    <slot />
  </button>
</template>
