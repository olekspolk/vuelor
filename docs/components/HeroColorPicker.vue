<script setup>
import { ref, watch } from 'vue'
import ColorPicker from './examples/ColorPicker.vue'

const color = ref('#B63DDA')

watch(color, (hex) => {
  if (window.innerWidth > 700) {
    document.documentElement.style.setProperty('--vuelor-selected-color', hex)
  }
})
</script>

<template>
  <ColorPicker
    v-model="color"
    format="hex"
  />
</template>
