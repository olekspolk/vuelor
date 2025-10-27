<script setup lang="ts">
import { useTemplateRef, watchEffect } from 'vue'
import { fillCanvas } from '../utils/canvas.ts'
import { injectColorPickerContext } from './ColorPickerRoot.vue'
import { useThumb } from '../composables/useThumb.ts'

const rootContext = injectColorPickerContext()
const canvasRef = useTemplateRef<HTMLCanvasElement | null>('canvasRef')

interface CanvasProps {
  height?: number,
  width?: number,
  class?: string,
  ui?: {
    root?: string,
    area?: string,
    thumb?: string
  }
}

const props = withDefaults(defineProps<CanvasProps>(), {
  height: 208,
  width: 208
})

const { thumbStyles, handleKeyDown } = useThumb(canvasRef)

watchEffect(() => {
  const ctx = canvasRef.value?.getContext('2d')
  ctx && fillCanvas(ctx, rootContext.hsv.value.h)
})

const ui = rootContext.uiSlots('canvas', 'shared')
</script>

<template>
  <div :class="ui.root(props.ui?.root, props.class)">
    <canvas
      ref="canvasRef"
      :height="props.height"
      :width="props.width"
      :class="ui.area(props.ui?.area)"
    />
    <span
      tabindex="0"
      :style="thumbStyles"
      :class="ui.thumb(props.ui?.thumb)"
      @keydown="handleKeyDown"
    />
  </div>
</template>
