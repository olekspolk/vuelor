<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed, useTemplateRef, watchEffect } from 'vue'
import { injectColorPickerContext } from './ColorPickerRoot.vue'
import { drawHsvGradient, drawHslGradient } from '../utils/canvas.ts'
import { useThumb } from '../composables/useThumb.ts'

const rootContext = injectColorPickerContext()
const canvasRef = useTemplateRef<HTMLCanvasElement | null>('canvasRef')

interface CanvasProps {
  type?: 'HSV' | 'HSL',
  height?: number,
  width?: number,
  wheel?: boolean,
  class?: string,
  ui?: {
    root?: string,
    area?: string,
    thumb?: string
  }
}

const props = withDefaults(defineProps<CanvasProps>(), {
  type: 'HSV',
  height: 208,
  width: 208,
  wheel: true
})

const style = computed<CSSProperties>(() => {
  return {
    position: 'relative',
    height: `${props.height}px`,
    width: `${props.width}px`,
  }
})

watchEffect(() => {
  const ctx = canvasRef.value?.getContext('2d')
  if (ctx) {
    switch (props.type) {
      case 'HSL':
        drawHslGradient(ctx, rootContext.hsv.value.h)
        break
      case 'HSV':
        drawHsvGradient(ctx, rootContext.hsv.value.h)
        break
    }
  }
})

const formatType = computed<'HSV' | 'HSL'>(() => props.type)

const {
  thumbStyles,
  handleWheel,
  handleKeyDown,
  handlePointerDown
} = useThumb(canvasRef, formatType)

const ui = rootContext.uiSlots('canvas', 'shared')
</script>

<template>
  <div
    :style="style"
    :class="ui.root(props.ui?.root, props.class)"
    :data-disabled="rootContext.disabled.value ? '' : null"
    @contextmenu.prevent
    @keydown="handleKeyDown"
    @pointerdown="handlePointerDown"
    @wheel="props.wheel && handleWheel($event)"
  >
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
    />
  </div>
</template>
