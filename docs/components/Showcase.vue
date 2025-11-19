<script setup>
import { ref } from 'vue'
import ColorPickerMini from './examples/ColorPickerMini.vue'
import ColorPickerMiniVertical from './examples/ColorPickerMiniVertical.vue'
import ColorPickerSlidersRGB from './examples/ColorPickerSlidersRGB.vue'
import ColorPickerSlidersHSL from './examples/ColorPickerSlidersHSL.vue'
import ColorPicker from './examples/ColorPicker.vue'
import ColorPickerWithTabs from './examples/ColorPickerWithTabs.vue'
import ColorPickerWithTabsVerticalSliders from './examples/ColorPickerWithTabsVerticalSliders.vue'
import ColorPickerPopover from './examples/ColorPickerPopover.vue'
import ColorPickerWithGradient from './examples/ColorPickerWithGradient.vue'

const color = ref(null)
</script>

<template>
  <div class="vuelor grid sm:grid-cols-1 md:grid-cols-2 gap-2">
    <div class="item">
      <ColorPickerWithGradient />
    </div>
    <div class="item">
      <ColorPickerMini v-model="color" />
    </div>
    <div class="item">
      <ColorPickerMiniVertical v-model="color" />
    </div>
    <div class="item">
      <ColorPickerSlidersRGB v-model="color" />
    </div>
    <div class="item">
      <ColorPickerSlidersHSL v-model="color" />
    </div>
    <div class="item">
      <ColorPicker v-model="color" />
    </div>
    <div class="item">
      <ColorPickerWithTabs v-model="color" />
    </div>
    <div class="item">
      <ColorPickerWithTabsVerticalSliders v-model="color" />
    </div>
    <div class="item">
      <ColorPickerPopover v-model="color" />
    </div>
  </div>
</template>

<style scoped>
.item {
  padding: 48px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background-color: var(--vp-sidebar-bg-color);
}
</style>
