<script setup lang="ts">
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const rootContext = injectColorPickerContext()
</script>

<template>
  <div
    class="flex gap-[1px] rounded-[5px] hover:outline-1 outline-[#e6e6e6] focus-within:outline-1 focus-within:outline-[#0d99ff]">
    <input type="text" v-model="rootContext.rgba.value.r"
      class="w-full bg-[#f5f5f5] rounded-l-[5px] px-1 h-6 flex-1 focus:outline-none text-[11px]"
      aria-label="Red" />
    <input type="text" :value="rootContext.rgba.value.g"
      class="w-full bg-[#f5f5f5] rounded-l-[5px] px-1 h-6 flex-1 focus:outline-none text-[11px]"
      aria-label="Green" />
    <input type="text" :value="rootContext.rgba.value.b"
      class="w-full bg-[#f5f5f5] rounded-l-[5px] px-1 h-6 flex-1 focus:outline-none text-[11px]"
      aria-label="Blue" />
    <input type="text" :value="rootContext.alpha.value" class="w-12 bg-[#f5f5f5] rounded-r-[5px] px-2 h-6 focus:outline-none text-[11px]"
      aria-label="Alpha" />
  </div>
</template>

<style scoped></style>
