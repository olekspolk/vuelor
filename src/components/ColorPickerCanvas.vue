<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { Position } from '../utils/types.ts';
import { RGBAtoCSS } from '../utils/utils.ts';
import ColorPickerCanvasThumb from './ColorPickerCanvasThumb.vue';
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const rootContext = injectColorPickerContext()
const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);

const props = defineProps<{
  class?: string;
  step?: number;
}>();

const width = ref(208);
const height = ref(208);
const thumbPosition = ref({ top: 0, left: 0 });
const thumbColor = computed(() => RGBAtoCSS({ ...rootContext.rgba.value, a: 1 }));

onMounted(() => {
  const cnv = canvas.value
  if (cnv) {
    ctx.value = cnv.getContext('2d')
    width.value = cnv.width
    height.value = cnv.height
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
  ctx.value.rect(0, 0, width.value, height.value)
  ctx.value.fillStyle = color
  ctx.value.fillRect(0, 0, width.value, height.value)

  const grdWhite = ctx.value.createLinearGradient(0, 0, width.value, 0)
  grdWhite.addColorStop(0, 'rgba(255,255,255,1)')
  grdWhite.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.value.fillStyle = grdWhite
  ctx.value.fillRect(0, 0, width.value, height.value)

  const grdBlack = ctx.value.createLinearGradient(0, 0, 0, height.value)
  grdBlack.addColorStop(0, 'rgba(0,0,0,0)')
  grdBlack.addColorStop(1, 'rgba(0,0,0,1)')
  ctx.value.fillStyle = grdBlack
  ctx.value.fillRect(0, 0, width.value, height.value)
}

watch(() => rootContext.hsva.value.h, updateCanvasFill)
watch(() => rootContext.hsva.value, updateThumbPosition, { immediate: true })
</script>

<template>
  <div class="relative">
    <canvas class="rounded-[5px] outline-1 outline-solid -outline-offset-1 outline-[#0000001a]" ref="canvas"
      :height="height" :width="width" />
    <ColorPickerCanvasThumb :step="props.step" :color="thumbColor" :modelValue="thumbPosition"
      @move="handleThumbMove" />
  </div>
</template>
