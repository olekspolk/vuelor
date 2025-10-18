<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { ref, computed, watch, onMounted } from 'vue'
import type { Position } from '../utils/types.ts'
import { RGBAtoCSS } from '../utils/utils.ts'
import { canvas } from '../theme'
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

const thumbPosition = ref({ top: 0, left: 0 });
const thumbColor = computed(() => RGBAtoCSS({ ...rootContext.rgba.value, a: 1 }));

onMounted(() => {
  const cnv = canvasRef.value
  if (cnv) {
    ctx.value = cnv.getContext('2d')
    updateThumbPosition()
    updateCanvasFill()
  }
});

function handleThumbMove(value: Position) {
  rootContext.hsva.value = {
    ...rootContext.hsva.value,
    s: value.left / 100,
    v: (100 - value.top) / 100,
  }
}

function updateThumbPosition() {
  thumbPosition.value = {
    top: 100 - rootContext.hsva.value.v * 100,
    left: rootContext.hsva.value.s * 100
  }
}

function updateCanvasFill() {
  if (!ctx.value) return

  const color = `hsl(${rootContext.hsva.value.h},100%,50%)`
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

watch(() => rootContext.hsva.value.h, updateCanvasFill)
watch(() => rootContext.hsva.value, updateThumbPosition, { immediate: true })

const ui = tv(canvas)()
</script>

<template>
  <div :class="ui.root({ class: [props.ui?.root, props.class] })">
    <canvas
      ref="canvasRef"
      :class="ui.canvas({ class: props.ui?.canvas })"
      :height="props.height"
      :width="props.width"
    />
    <ColorPickerCanvasThumb
      :step="props.step"
      :color="thumbColor"
      :modelValue="thumbPosition"
      @move="handleThumbMove"
    />
  </div>
</template>
