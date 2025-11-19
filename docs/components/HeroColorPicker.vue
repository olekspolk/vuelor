<script setup>
import { ref, onMounted, watch } from 'vue'
import ColorPicker from './examples/ColorPicker.vue'

const color = ref('#B63DDAFF')

onMounted(() => {
  color.value = document.documentElement.style.getPropertyValue('--vuelor-selected-color') || '#B63DDAFF'
})

watch(color, (value) => {
  if (window.innerWidth > 700) {
    document.documentElement.style.setProperty('--vuelor-selected-color', value)
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
