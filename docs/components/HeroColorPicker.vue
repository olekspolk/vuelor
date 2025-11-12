<script setup>
import { ref, watch } from 'vue'
import ColorPicker from './examples/ColorPicker.vue'

const color = ref('#B63DDAFF')

watch(color, (hex) => {
  if (window.innerWidth > 700) {
    document.documentElement.style.setProperty('--vuelor-selected-color', hex)
  }
})
</script>

<template>
  <div class="vuelor">
    <ColorPicker
      v-model="color"
      format="hexa"
    />
  </div>
</template>
