<template>
  <div class="color-picker_area">
    <canvas
      ref="canvas"
      height="240"
      width="240"
    />
    <ColorPickerPoint
      ref="point"
      mode="area"
      :color="pointColor"
      :value="position"
      @move="handlePointMove"
    />
  </div>
</template>

<script lang="ts">
import { Prop, Emit, Watch, Component, Vue } from 'vue-property-decorator';
import { Position, Color} from './types'
import { fromHSVA, RGBAtoCSS } from './utils'

import ColorPickerPoint from './ColorPickerPoint.vue'

@Component({
  components: {
    ColorPickerPoint
  }
})
export default class ColorPickerCanvas extends Vue {
  @Prop() readonly value!: Color

  ctx: CanvasRenderingContext2D | null = null
  width: number = 240
  height: number = 240
  position: Position = { top: 0, left: 0 }
  isInteracting: boolean = false

  get hue (): number {
    return this.value.hue
  }

  get pointColor (): string {
    return RGBAtoCSS({ ...this.value.rgba, a: 1})
  }

  mounted () {
    const canvas = this.$refs.canvas as HTMLCanvasElement
    this.ctx = canvas.getContext('2d')
    this.width = canvas.width
    this.height = canvas.height
    this.updatePointPosition()
    this.updateCanvasFill()
  }

  handlePointMove (value: Position) {
    this.isInteracting = true
    const color = fromHSVA({
      ...this.value.hsva,
      s: value.left / 100,
      v: (100 - value.top) / 100,
    })
    this.onInput(color)
  }

  updatePointPosition () {
    if (this.isInteracting) {
      this.isInteracting = false
      return
    }
    this.position = {
      top: 100 - this.value.hsva.v * 100,
      left: this.value.hsva.s * 100
    }
  }

  updateCanvasFill () {
    if (!this.ctx) return

    const color = `hsl(${this.value.hue},100%,50%)`
    this.ctx.rect(0, 0, this.width, this.height)
    this.ctx.fillStyle = color
    this.ctx.fillRect(0, 0, this.width, this.height)

    const grdWhite = this.ctx.createLinearGradient(0, 0, this.width, 0)
    grdWhite.addColorStop(0, 'rgba(255,255,255,1)')
    grdWhite.addColorStop(1, 'rgba(255,255,255,0)')
    this.ctx.fillStyle = grdWhite
    this.ctx.fillRect(0, 0, this.width, this.height)

    const grdBlack = this.ctx.createLinearGradient(0, 0, 0, this.height)
    grdBlack.addColorStop(0, 'rgba(0,0,0,0)')
    grdBlack.addColorStop(1, 'rgba(0,0,0,1)')
    this.ctx.fillStyle = grdBlack
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  @Emit('input')
  onInput (value: Color) {
    return value
  }

  @Watch('hue')
  onHueChanged () {
    this.updateCanvasFill()
  }

  @Watch('value')
  onValueChanged () {
    this.updatePointPosition()
  }
}
</script>

<style scoped>
.color-picker_area {
  position: relative;
  height: 240px;
  width: 240px;
}
</style>
