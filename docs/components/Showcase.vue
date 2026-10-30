<script setup>
import { ref } from 'vue'
import { NAMESPACE, itemNameForFile } from '../registry.config.mjs'
import CopyCommand from './CopyCommand.vue'
import ColorPickerMiniStyled from './examples/ColorPickerMiniStyled.vue'
import ColorPickerMiniVerticalStyled from './examples/ColorPickerMiniVerticalStyled.vue'
import ColorPickerSlidersRGB from './examples/ColorPickerSlidersRGB.vue'
import ColorPickerSlidersHSL from './examples/ColorPickerSlidersHSL.vue'
import ColorPicker from './examples/ColorPicker.vue'
import ColorPickerWithTabs from './examples/ColorPickerWithTabs.vue'
import ColorPickerWithTabsVerticalSliders from './examples/ColorPickerWithTabsVerticalSliders.vue'
import ColorPickerPopover from './examples/ColorPickerPopover.vue'
import ColorPickerWithGradient from './examples/ColorPickerWithGradient.vue'
import GradientPicker from './examples/GradientPicker.vue'

const color = ref(null)

// `bound: false` renders the picker standalone (the gradient editor keeps its own value rather than
// sharing the object-format `color` model used by the others).
const examples = [
  { component: ColorPickerMiniStyled, file: 'ColorPickerMiniStyled.vue', bound: true },
  { component: ColorPickerMiniVerticalStyled, file: 'ColorPickerMiniVerticalStyled.vue', bound: true },
  { component: ColorPickerSlidersRGB, file: 'ColorPickerSlidersRGB.vue', bound: true },
  { component: ColorPickerSlidersHSL, file: 'ColorPickerSlidersHSL.vue', bound: true },
  { component: ColorPicker, file: 'ColorPicker.vue', bound: true },
  { component: ColorPickerWithTabs, file: 'ColorPickerWithTabs.vue', bound: true },
  { component: ColorPickerWithTabsVerticalSliders, file: 'ColorPickerWithTabsVerticalSliders.vue', bound: true },
  { component: ColorPickerPopover, file: 'ColorPickerPopover.vue', bound: true },
  { component: ColorPickerWithGradient, file: 'ColorPickerWithGradient.vue', bound: false },
  { component: GradientPicker, file: 'GradientPicker.vue', bound: false },
].map((e) => ({
  ...e,
  command: `npx shadcn-vue@latest add ${NAMESPACE}/${itemNameForFile(e.file)}`,
}))
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 md:gap-5">
    <div
      v-for="ex in examples"
      :key="ex.command"
      class="flex flex-col overflow-hidden rounded-2xl border border-line bg-ink-raised/70"
    >
      <div
        data-vuelor-docs
        class="vuelor-demo-stage flex flex-1 items-center justify-center px-3 py-12"
      >
        <component :is="ex.component" v-if="ex.bound" v-model="color" format="object" />
        <component :is="ex.component" v-else />
      </div>

      <div class="border-t border-line">
        <CopyCommand :command="ex.command" />
      </div>
    </div>
  </div>
</template>
