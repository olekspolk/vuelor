<template>
  <div
    :style="styles"
    class="input-range_point"
  >
    <span :style="{ backgroundColor: color }" />
  </div>
</template>

<script lang="ts">
import { CSSProperties } from 'vue/types/jsx';
import { Prop, Emit, Watch, Component, Vue } from 'vue-property-decorator';
import { Position } from './types'
import { clamp, getPointerPosition } from './helpers'

@Component
export default class ColorPickerPoint extends Vue {
  @Prop() readonly color!: string
  @Prop({ default: true }) readonly active!: boolean
  @Prop() readonly value!: number | { top: number, left: number }
  @Prop({ default: 'horizontal' }) readonly mode!: 'horizontal' | 'area'
  @Prop({ default: 20 }) readonly size!: number

  readonly bounding = {
    top: 0,
    left: 0,
    width: 0,
    height: 0
  }

  readonly pos = {
    x: 0,
    y: 0
  }

  get width (): number {
    return this.mode === 'horizontal'
      ? this.bounding.width - this.size
      : this.bounding.width
  }

  get styles (): CSSProperties {
    return {
      top: this.mode === 'horizontal' ? '50%' : '0',
      transform: this.mode === 'horizontal'
       ? `translate3d(${this.pos.x}px, -50%, 0px)`
       : `translate3d(${this.pos.x}px, ${this.pos.y}px, 0px)`
    }
  }

  mounted () {
    this.setPosition(this.value)
    const parent = this.$parent?.$el as HTMLElement
    if (parent) {
      parent.addEventListener('mousedown', this.handleMousedown)
    }
  }

  handleMousedown (event: MouseEvent) {
    if (this.active && this.$parent) {
      const rect = this.$parent.$el.getBoundingClientRect()
      const parentEl = this.$parent.$el as HTMLElement
      this.bounding.top = rect.top
      this.bounding.left = rect.left
      this.bounding.width = parentEl.offsetWidth
      this.bounding.height = parentEl.offsetHeight
      this.handleMousemove(event)
      document.addEventListener('mousemove', this.handleMousemove)
      document.addEventListener('mouseup', this.handleMouseup)
    }
  }

  handleMouseup () {
    document.removeEventListener('mousemove', this.handleMousemove)
    document.removeEventListener('mouseup', this.handleMouseup)
  }

  @Emit('move')
  handleMousemove (event: MouseEvent) {
    event.preventDefault()
    const pointer = getPointerPosition(event)
    const shiftY = pointer.pageY - (this.bounding.top + this.size / 2)
    const shiftX = pointer.pageX - (this.bounding.left + this.size / 2)

    this.pos.x = this.getPosX(shiftX) // px
    this.pos.y = this.getPosY(shiftY) // px

    const left = this.mode === 'area' // %
      ? (this.pos.x + 10) / this.bounding.width * 100
      : this.pos.x / this.width * 100

    const top = this.mode === 'area' // %
      ? (this.pos.y + 10) / this.bounding.height * 100
      : 0
    return { left, top }
  }

  setPosition (value: number | Position) {
    if (typeof value === 'object') {
      this.pos.y = value.top * 240 / 100 - this.size / 2
      this.pos.x = value.left * 240 / 100 - this.size / 2
    } else {
      this.pos.x = value * 200 / 100
    }
  }

  getPosX (value: number) {
    const min = this.mode === 'area'
      ? -this.size / 2
      : 0
    const max = this.mode === 'area'
      ? this.bounding.width - this.size / 2
      : this.bounding.width - this.size
    return clamp(value, min, max)
  }

  getPosY (value: number) {
    if (this.mode === 'area') {
      const min = -this.size / 2
      const max = this.bounding.height - this.size / 2
      return clamp(value, min, max)
    }
    return 0
  }

  @Watch('value')
  onValueChanged (value: number | Position) {
    this.setPosition(value)
  }
}
</script>

<style lang="scss" scoped>
.input-range_point {
  position: absolute;
  z-index: 2;
  height: 20px;
  width: 20px;
  border-radius: 15px;
  box-shadow:
    rgba(0, 0, 0, 0.15) 0 0 0 1px,
    rgba(0, 0, 0, 0.05) 0 10px 10px -5px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    display: inline;
    height: 10px;
    width: 10px;
    pointer-events: none;
    border-radius: 50%;
    box-shadow: inset rgba(0, 0, 0, 0.15) 0 0 0 1px;
  }
}
</style>
