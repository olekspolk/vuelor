<script setup lang="ts">
import { computed, useTemplateRef, watchEffect } from 'vue'
import { RGBAtoCSS } from '../utils/color.ts'
import type { ThumbPosition } from './ColorPickerCanvasThumb.vue'
import { fillCanvas } from '../utils/canvas.ts'
import ColorPickerCanvasThumb from './ColorPickerCanvasThumb.vue'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const rootContext = injectColorPickerContext()
const canvasRef = useTemplateRef<HTMLCanvasElement | null>('canvasRef')

interface CanvasProps {
  height?: number,
  width?: number,
  class?: string,
  step?: number,
  ui?: {
    root?: string,
    area?: string,
    thumb?: string
  }
}

const props = withDefaults(defineProps<CanvasProps>(), {
  height: 208,
  width: 208,
  step: 1
})

const thumbColor = computed(() => RGBAtoCSS({ ...rootContext.rgba.value, a: 1 }));
const thumbPosition = computed({
  get: () => ({
    top: 100 - rootContext.hsv.value.v * 100,
    left: rootContext.hsv.value.s * 100
  }),
  set: (value: ThumbPosition) => {
    rootContext.hsv.value = {
      ...rootContext.hsv.value,
      s: value.left / 100,
      v: (100 - value.top) / 100,
    }
  }
})

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
    <ColorPickerCanvasThumb
      :step="props.step"
      :color="thumbColor"
      :class="ui.thumb(props.ui?.thumb)"
      v-model="thumbPosition"
    />
  </div>
</template>
