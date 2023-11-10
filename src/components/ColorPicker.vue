<template>
  <div class="color-picker">
    <ColorPickerHeader
      v-if="showHeader"
      v-model="mode"
      @close="$emit('close')"
    />

    <div
      v-if="isGradientMode"
      class="inner"
    >
      <ColorPickerRange
        v-model="gradient.points"
        :color="color.rgba"
        :background="gradientBackground"
        @select="handleGradientPointSelect"
      />
      <ColorPickerRange
        v-model="gradient.angle"
        :min="0"
        :max="360"
        @interaction:start="showGradientPreview = true"
        @interaction:end="showGradientPreview = false"
      />
    </div>

    <div
      v-if="showGradientPreview"
      class="preview"
      :style="{ background: value }"
    >
      <span>{{ gradient.angle }}°</span>
    </div>

    <ColorPickerCanvas
      v-else
      v-model="color" />

    <div class="inner">
      <ColorPickerHue v-model="color" />
      <ColorPickerAlpha v-model="color" />
      <ColorPickerInput v-model="color" />
    </div>

    <ColorPickerSwatches
      v-if="showSwatches"
      :items="swatches"
      @input="handleSwatchSelect"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'
import ColorPickerAlpha from './ColorPickerAlpha.vue'
import ColorPickerCanvas from './ColorPickerCanvas.vue'
import ColorPickerHeader from './ColorPickerHeader.vue'
import ColorPickerHue from './ColorPickerHue.vue'
import ColorPickerInput from './ColorPickerInput.vue'
import ColorPickerRange from './ColorPickerRange.vue'
import ColorPickerSwatches from './ColorPickerSwatches.vue'

import { deepEqual } from './helpers'
import { fromRGBA, pointsToCSSGradient, isGradient, parseColor, parseGradient } from './utils'
import { Gradient, Color, RGBA } from './types'
import { DEFAULT_COLOR, DEFAULT_GRADIENT } from './consts'

type Mode = 'color' | 'gradient'

@Component({
  components: {
    ColorPickerAlpha,
    ColorPickerCanvas,
    ColorPickerHeader,
    ColorPickerHue,
    ColorPickerRange,
    ColorPickerInput,
    ColorPickerSwatches
  }
})
export default class ColorPicker extends Vue {
  // hideCanvas: Boolean
  // hideSliders: Boolean
  // hideInputs: Boolean
  // hideGradientPreview: Boolean
  @Prop({ default: true }) readonly showHeader!: boolean
  @Prop() readonly showSwatches!: Boolean
  @Prop() readonly value!: string
  @Prop({ default: () => [] }) readonly swatches!: string[]

  mode: Mode = 'color'
  color: Color = fromRGBA(DEFAULT_COLOR)
  gradient: Gradient = DEFAULT_GRADIENT
  showGradientPreview: boolean = false
  lastEmitedValue: any = null

  get isGradientMode (): boolean {
    return this.mode === 'gradient'
  }

  get gradientBackground (): string {
    return pointsToCSSGradient(this.gradient.points, 90)
  }

  parseValue (value: any) {
    if (isGradient(value)) {
      this.gradient = parseGradient(value)
      const rgba = this.gradient.points[0]
      this.color = fromRGBA(rgba)
      this.mode = 'gradient'
    } else {
      this.color = parseColor(value)
      this.mode = 'color'
    }
  }

  handleGradientPointSelect (rgba: RGBA) {
    this.color = fromRGBA(rgba)
  }

  handleSwatchSelect (value: string) {
    if (this.isGradientMode && !isGradient(value)) {
      this.color = parseColor(value)
    } else {
      this.parseValue(value)
    }
  }

  @Emit('input')
  onInput (value: string | null) {
    this.lastEmitedValue = value
    return value
  }

  @Watch('value', { immediate: true })
  onValueChanged (value: any) {
    if (value && value !== this.lastEmitedValue) {
      this.parseValue(value)
    }
  }

  @Watch('color', { deep: true })
  @Watch('gradient', { deep: true })
  onColorUpdated () {
    const value = this.mode === 'color'
      ? this.color.hexa
      : pointsToCSSGradient(this.gradient.points, this.gradient.angle)
    if (!deepEqual(value, this.value)) {
      this.onInput(value)
    }
  }

  @Watch('mode')
  onModeChanged (value: Mode) {
    if (value === 'gradient') {
      const points = [...this.gradient.points]
      points[0] = { ...this.gradient.points[0], ...this.color.rgba }
      this.gradient.points = points
    } else {
      this.color = fromRGBA(this.gradient.points[0])
    }
  }
}
</script>

<style lang="scss">
.color-picker {
  --color-surface: #fff;
  --color-primary: #8E5AF1;

  width: 240px;
  border-radius: 3px;
  background-color: var(--color-surface);
  box-shadow: 0 0 8px rgba(0, 0, 0, .2);

  .inner {
    padding: 8px 10px;

    .color-input {
      margin-top: 5px;
    }
  }

  .preview {
    height: 240px;
    width: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
  }

  button {
    border: none;
    background: transparent;
  }
}
</style>
