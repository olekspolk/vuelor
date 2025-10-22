<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { ref, computed, watch } from 'vue'
import { canvas } from '../theme'
import { RGBAtoCSS } from '../utils/color.ts'
import type { ThumbPosition } from './ColorPickerCanvasThumb.vue'
import ColorPickerCanvasThumb from './ColorPickerCanvasThumb.vue'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const rootContext = injectColorPickerContext()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)

interface CanvasProps {
  height?: number,
  width?: number,
  class?: string,
  step?: number,
  ui?: Partial<typeof canvas.slots>
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
});

function updateCanvasFill() {
  if (!ctx.value) return

  const color = `hsl(${rootContext.hsv.value.h},100%,50%)`
  ctx.value.rect(0, 0, props.width, props.height)
  ctx.value.fillStyle = color
  ctx.value.fillRect(0, 0, props.width, props.height)

  const grdWhite = ctx.value.createLinearGradient(0, 0, props.width, 0)
  grdWhite.addColorStop(0, 'rgba(255,255,255,1)')
  grdWhite.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.value.fillStyle = grdWhite
  ctx.value.fillRect(0, 0, props.width, props.height)

  const grdBlack = ctx.value.createLinearGradient(0, 0, 0, props.height)
  grdBlack.addColorStop(0, 'rgba(0,0,0,0)')
  grdBlack.addColorStop(1, 'rgba(0,0,0,1)')
  ctx.value.fillStyle = grdBlack
  ctx.value.fillRect(0, 0, props.width, props.height)
}

watch(() => rootContext.hsv.value.h, updateCanvasFill)
watch(() => canvasRef.value, (canvas) => {
  if (canvas) {
    const context = canvas.getContext('2d')
    if (context) {
      ctx.value = context
      updateCanvasFill()
    }
  }
})

const ui = tv(canvas)({
  disabled: rootContext.disabled.value
})
</script>

<template>
  <div :class="ui.root({ class: [props.ui?.root, props.class] })">
    <canvas
      ref="canvasRef"
      :height="props.height"
      :width="props.width"
      :class="ui.canvas({ class: props.ui?.canvas })"
    />
    <ColorPickerCanvasThumb
      :step="props.step"
      :color="thumbColor"
      v-model="thumbPosition"
    />
  </div>
</template>
