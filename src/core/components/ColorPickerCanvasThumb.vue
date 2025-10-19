<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { Position } from '../utils/types.ts'
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { tv } from 'tailwind-variants'
import { slider } from '../theme'
import { clamp, getPointerPosition } from '../utils/helpers.ts'

const emit = defineEmits(['update:modelValue'])

const instance = getCurrentInstance()

interface Props {
  class?: string,
  modelValue: Position
  color: string
  step?: number
}

const props = withDefaults(defineProps<Props>(), {
  color: '#fff',
  step: 1
})

const bounding = ref({
  top: 1,
  left: 1,
  width: 1,
  height: 1
})

const styles = computed<CSSProperties>(() => {
  const x = props.modelValue.left * bounding.value.width / 100
  const y = props.modelValue.top * bounding.value.height / 100
  return {
    top: '0',
    left: '0',
    position: 'absolute',
    backgroundColor: props.color,
    transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0px)`
  }
})

onMounted(() => {
  const parent = instance?.parent?.vnode.el as HTMLElement
  if (parent) {
    parent.addEventListener('mousedown', handleMousedown)
    const rect = parent.getBoundingClientRect()
    const parentEl = parent as HTMLElement
    bounding.value.top = rect.top
    bounding.value.left = rect.left
    bounding.value.width = parentEl.offsetWidth
    bounding.value.height = parentEl.offsetHeight
  }
})

function handleMousedown(e: MouseEvent) {
  document.addEventListener('mousemove', handleMousemove)
  document.addEventListener('mouseup', handleMouseup)
  handleMousemove(e)
}

function handleMouseup() {
  document.removeEventListener('mousemove', handleMousemove)
  document.removeEventListener('mouseup', handleMouseup)
}

function handleMousemove(event: MouseEvent) {
  event.preventDefault()
  const pointer = getPointerPosition(event)
  const shiftY = pointer.pageY - bounding.value.top
  const shiftX = pointer.pageX - bounding.value.left
  emit('update:modelValue', {
    top: clamp(shiftY, 0, bounding.value.height) / bounding.value.height * 100,
    left: clamp(shiftX, 0, bounding.value.width) / bounding.value.width * 100
  })
}

function handleKeydown(event: KeyboardEvent) {
  const step = event.shiftKey ? props.step * 10 : props.step
  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault()
      emit('update:modelValue', {
        left: props.modelValue.left,
        top: clamp(props.modelValue.top - step, 0, 100)
      })
      break
    case 'ArrowDown':
      event.preventDefault()
      emit('update:modelValue', {
        left: props.modelValue.left,
        top: clamp(props.modelValue.top + step, 0, 100)
      })
      break
    case 'ArrowLeft':
      event.preventDefault()
      emit('update:modelValue', {
        left: clamp(props.modelValue.left - step, 0, 100),
        top: props.modelValue.top
      })
      break
    case 'ArrowRight':
      event.preventDefault()
      emit('update:modelValue', {
        left: clamp(props.modelValue.left + step, 0, 100),
        top: props.modelValue.top
      })
      break
  }
}

const ui = tv(slider)()
</script>

<template>
  <div
    tabindex="0"
    :style="styles"
    :class="ui.thumb({ class: props.class })"
    @keydown="handleKeydown"
  />
</template>
