<script setup>
import { ref } from 'vue'
import ColorPickerMiniStyled from './examples/ColorPickerMiniStyled.vue'
import ColorPickerMiniVerticalStyled from './examples/ColorPickerMiniVerticalStyled.vue'
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
  <div data-vuelor-docs class="grid sm:grid-cols-1 md:grid-cols-2 gap-2">
    <div class="flex items-center justify-center py-12 px-3 rounded-lg bg-[var(--vp-sidebar-bg-color)]">
      <ColorPickerMiniStyled v-model="color" />
    </div>
    <div class="flex items-center justify-center py-12 px-3 rounded-lg bg-[var(--vp-sidebar-bg-color)]">
      <ColorPickerMiniVerticalStyled v-model="color" />
    </div>
    <div class="flex items-center justify-center py-12 px-3 rounded-lg bg-[var(--vp-sidebar-bg-color)]">
      <ColorPickerSlidersRGB v-model="color" />
    </div>
    <div class="flex items-center justify-center py-12 px-3 rounded-lg bg-[var(--vp-sidebar-bg-color)]">
      <ColorPickerSlidersHSL v-model="color" />
    </div>
    <div class="flex items-center justify-center py-12 px-3 rounded-lg bg-[var(--vp-sidebar-bg-color)]">
      <ColorPicker v-model="color" />
    </div>
    <div class="flex items-center justify-center py-12 px-3 rounded-lg bg-[var(--vp-sidebar-bg-color)]">
      <ColorPickerWithTabs v-model="color" />
    </div>
    <div class="flex items-center justify-center py-12 px-3 rounded-lg bg-[var(--vp-sidebar-bg-color)]">
      <ColorPickerWithTabsVerticalSliders v-model="color" />
    </div>
    <div class="flex items-center justify-center py-12 px-3 rounded-lg bg-[var(--vp-sidebar-bg-color)]">
      <ColorPickerWithGradient />
    </div>
    <div class="flex items-center justify-center py-12 px-3 rounded-lg bg-[var(--vp-sidebar-bg-color)]">
      <ColorPickerPopover v-model="color" />
    </div>
  </div>
</template>
