<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { Position } from '../utils/types.ts'
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { tv } from 'tailwind-variants'
import { slider } from '../theme'
import { clamp, getPointerPosition } from '../utils/helpers.ts'

const emit = defineEmits(['move'])

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

const pos = ref({
  x: 0,
  y: 0
})

const styles = computed<CSSProperties>(() => ({
  backgroundColor: props.color,
  transform: `translate3d(calc(-50% + ${pos.value.x}px), calc(-50% + ${pos.value.y}px), 0px)`
}))

onMounted(() => {
  const parent = instance?.parent?.vnode.el as HTMLElement
  if (parent) {
    parent.addEventListener('mousedown', handleMousedown)
  }
  setPosition(props.modelValue)
})

const bounding = ref({
  top: 0,
  left: 0,
  width: 0,
  height: 0
})

function handleMousedown(e: MouseEvent) {
  const parent = instance?.parent?.vnode.el
  if (parent) {
    const rect = parent.getBoundingClientRect()
    const parentEl = parent as HTMLElement
    bounding.value.top = rect.top
    bounding.value.left = rect.left
    bounding.value.width = parentEl.offsetWidth
    bounding.value.height = parentEl.offsetHeight
    handleMousemove(e)
    document.addEventListener('mousemove', handleMousemove)
    document.addEventListener('mouseup', handleMouseup)
  }
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
  pos.value.x = clamp(shiftX, 0, bounding.value.width)
  pos.value.y = clamp(shiftY, 0, bounding.value.height)
  const top = pos.value.y / bounding.value.height * 100
  const left = pos.value.x / bounding.value.width * 100
  emit('move', { left, top })
}

function handleKeydown(event: KeyboardEvent) {
  let flag = false
  const step = event.shiftKey ? props.step * 10 : props.step
  switch (event.key) {
    case 'ArrowUp':
      pos.value.y = clamp(pos.value.y - step, 0, bounding.value.height)
      flag = true
      break
    case 'ArrowDown':
      pos.value.y = clamp(pos.value.y + step, 0, bounding.value.height)
      flag = true
      break
    case 'ArrowLeft':
      pos.value.x = clamp(pos.value.x - step, 0, bounding.value.width)
      flag = true
      break
    case 'ArrowRight':
      pos.value.x = clamp(pos.value.x + step, 0, bounding.value.width)
      flag = true
      break
  }
  if (flag) {
    event.preventDefault()
    const top = pos.value.y / bounding.value.height * 100
    const left = pos.value.x / bounding.value.width * 100
    emit('move', { left, top })
  }
}

function setPosition(value: Position) {
  pos.value.y = value.top * bounding.value.height / 100
  pos.value.x = value.left * bounding.value.width / 100
}

watch(() => props.modelValue, (value: Position) => setPosition(value))

const ui = tv(slider)()
</script>

<template>
  <div
    :style="styles"
    tabindex="0"
    :class="ui.thumb({ class: props.class })"
    @keydown="handleKeydown"
  />
</template>
