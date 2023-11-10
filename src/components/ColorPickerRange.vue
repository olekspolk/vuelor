<template>
  <div
    class="input-range"
    @mousedown="handleInteractionStart"
  >
    <div
      :style="styles"
      class="input-range_track"
    />
    <ColorPickerPoint
      v-for="(point, index) of points"
      :key="index"
      :color="point.color"
      :active="activeIndex === index"
      :value="getPercent(point.left)"
      @mousedown.native="onSelect(index)"
      @move="handlePointMove"
    />
  </div>
</template>

<script lang="ts">
import { CSSProperties } from 'vue/types/jsx';
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { RGBA, Point } from './types';
import { RGBAtoCSS } from './utils';
import ColorPickerPoint from './ColorPickerPoint.vue'

@Component({
  components: { ColorPickerPoint }
})
export default class ColorPickerRange extends Vue {
  @Prop({ default: 'var(--color-primary)' }) readonly color!: RGBA | string
  @Prop() readonly value!: number | Point[]
  @Prop() readonly background!: string | string[]
  @Prop({ default: 0 }) readonly min!: number
  @Prop({ default: 100 }) readonly max!: number

  activeIndex: number = 0

  get isMultipointMode (): boolean {
    return Array.isArray(this.value)
  }

  get styles (): CSSProperties {
    return {
      '--input-range-track-background': this.background
        ? Array.isArray(this.background)
          ? `linear-gradient(to right, ${this.background})`
          : this.background
        : `linear-gradient(to right, ${this.color} ${this.percent}%, #eee ${this.percent}%)`
    }
  }

  get percent (): number {
    return typeof this.value === 'number'
      ? this.getPercent(this.value)
      : 0
  }

  getPercent (value: number): number {
    return value / (this.max - this.min) * 100
  }

  get points () {
    if (Array.isArray(this.value)) {
      return this.value.map((p: Point) => ({
        color: RGBAtoCSS(p),
        left: p.left
      }))
    }
    return [
      {
        color: this.color,
        left: this.value
      }
    ]
  }

  @Emit('select')
  onSelect (index: number) {
    this.activeIndex = index
    return Array.isArray(this.value)
      ? this.value[index]
      : this.value
  }

  @Emit('input')
  handlePointMove ({ left }: { left: number}): number | Point[] {
    const range = this.max - this.min
    const value = range > 100
      ? Math.floor(range / 100 * left)
      : range / 100 * left
    if (Array.isArray(this.value)) {
      const points = [...this.value]
      points[this.activeIndex].left = value
      return points
    }
    return value
  }

  @Watch('color', { deep: true })
  onColorChanged(color: RGBA | string) {
    if (typeof color !== 'string' && Array.isArray(this.value)) {
      const index = this.activeIndex
      const points = [...this.value]
      points[index] = { ...points[index], ...color }
      this.onInput(points)
    }
  }

  @Emit('input')
  onInput (value: number | Point[]): number | Point[] {
    return value
  }

  handleInteractionStart () {
    document.addEventListener('mouseup', this.handleInteractionEnd)
    this.onInteractionStart()
  }

  @Emit('interaction:start')
  onInteractionStart () {}

  handleInteractionEnd () {
    document.removeEventListener('mouseup', this.handleInteractionEnd)
    this.onInteractionEnd()
  }

  @Emit('interaction:end')
  onInteractionEnd () {}
}
</script>

<style lang="scss" scoped>
.input-range {
  position: relative;
  height: 26px;

  &_track {
    position: absolute;
    top: 50%;
    width: 100%;
    height: 10px;
    border-radius: 10px;
    transform: translate3d(0, -50%, 0);
    box-shadow: inset rgba(0, 0, 0, 0.08) 0 0 0 1px;
    background: repeating-conic-gradient(#ddd 0% 25%, transparent 0% 50%) 50% / 5px 5px;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      border-radius: 10px;
      background: var(--input-range-track-background);
    }
  }
}
</style>
