<script setup lang="ts">
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const rootContext = injectColorPickerContext()
</script>

<template>
  <div
    class="flex gap-[1px] rounded-[5px] hover:outline-1 outline-[#e6e6e6] focus-within:outline-1 focus-within:outline-[#0d99ff]">
    <input type="text" v-model="rootContext.hexa.value"
      class="w-full flex-1 bg-[#f5f5f5] rounded-l-[5px] px-2 h-6 focus:outline-none text-[11px]"
      aria-label="Hex color" />
    <input type="text" value="100%" class="w-12 bg-[#f5f5f5] rounded-r-[5px] px-2 h-6 focus:outline-none text-[11px]"
      aria-label="Hex color" />
  </div>
</template>

<style scoped></style>
