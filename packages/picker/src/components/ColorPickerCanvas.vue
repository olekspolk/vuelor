<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed, useTemplateRef } from 'vue'
import { injectColorPickerContext } from './ColorPickerRoot.vue'
import { useThumb } from '../composables/useThumb.ts'

const rootContext = injectColorPickerContext()
const rootRef = useTemplateRef<HTMLElement | null>('rootRef')

interface CanvasProps {
  type?: 'HSV' | 'HSL',
  wheel?: boolean,
  class?: string,
  ui?: {
    root?: string,
    thumb?: string
  }
}

const props = withDefaults(defineProps<CanvasProps>(), {
  type: 'HSV',
  wheel: true
})

const gradientStyle = computed<CSSProperties>(() => {
  const h = rootContext.hsv.value.h
  if (props.type === 'HSL') {
    return {
      background: [
        'linear-gradient(to top, black, transparent 50%)',
        'linear-gradient(to bottom, white, transparent 50%)',
        `linear-gradient(to right, hsl(${h}deg 0% 50%), hsl(${h}deg 100% 50%))`
      ].join(', ')
    }
  }
  return {
    background: [
      'linear-gradient(to bottom, transparent, black)',
      'linear-gradient(to right, white, transparent)',
      `hsl(${h}deg 100% 50%)`
    ].join(', ')
  }
})

const formatType = computed<'HSV' | 'HSL'>(() => props.type)

const {
  thumbStyles,
  handleWheel,
  handleKeyDown,
  handlePointerDown
} = useThumb(rootRef, formatType)

const ui = rootContext.uiSlots('canvas', 'shared')
</script>

<template>
  <div
    ref="rootRef"
    :style="gradientStyle"
    :class="ui.root(props.ui?.root, props.class)"
    :data-disabled="rootContext.disabled.value ? '' : null"
    @contextmenu.prevent
    @keydown="handleKeyDown"
    @pointerdown="handlePointerDown"
    @wheel="props.wheel && handleWheel($event)"
  >
    <span
      tabindex="0"
      :style="thumbStyles"
      :class="ui.thumb(props.ui?.thumb)"
    />
  </div>
</template>
