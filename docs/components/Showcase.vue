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
    <div class="flex items-center justify-center rounded-lg border border-[var(--vp-c-divider)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] py-10 px-3">
      <ColorPickerMiniStyled
        v-model="color"
        format="object"
      />
    </div>
    <div class="flex items-center justify-center rounded-lg border border-[var(--vp-c-divider)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] py-10 px-3">
      <ColorPickerMiniVerticalStyled
        v-model="color"
        format="object"
      />
    </div>
    <div class="flex items-center justify-center rounded-lg border border-[var(--vp-c-divider)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] py-10 px-3">
      <ColorPickerSlidersRGB
        v-model="color"
        format="object"
      />
    </div>
    <div class="flex items-center justify-center rounded-lg border border-[var(--vp-c-divider)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] py-10 px-3">
      <ColorPickerSlidersHSL
        v-model="color"
        format="object"
      />
    </div>
    <div class="flex items-center justify-center rounded-lg border border-[var(--vp-c-divider)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] py-10 px-3">
      <ColorPicker
        v-model="color"
        format="object"
      />
    </div>
    <div class="flex items-center justify-center rounded-lg border border-[var(--vp-c-divider)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] py-10 px-3">
      <ColorPickerWithTabs
        v-model="color"
        format="object"
      />
    </div>
    <div class="flex items-center justify-center rounded-lg border border-[var(--vp-c-divider)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] py-10 px-3">
      <ColorPickerWithTabsVerticalSliders
        v-model="color"
        format="object"
      />
    </div>
    <div class="flex items-center justify-center rounded-lg border border-[var(--vp-c-divider)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] py-10 px-3">
      <ColorPickerWithGradient />
    </div>
    <div class="flex items-center justify-center rounded-lg border border-[var(--vp-c-divider)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] py-10 px-3">
      <ColorPickerPopover
        v-model="color"
        format="object"
      />
    </div>
  </div>
</template>
