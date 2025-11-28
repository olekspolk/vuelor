<script setup>
import { ref, onMounted, watch } from 'vue'
import ColorPicker from './examples/ColorPickerWithGradient.vue'

const color = ref('#B63DDAFF')

onMounted(() => {
  color.value = document.documentElement.style.getPropertyValue('--vuelor-selected-value') || '#B63DDAFF'
})

watch(color, (value) => {
  if (window.innerWidth > 700) {
    document.documentElement.style.setProperty('--vuelor-selected-value', value)
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
