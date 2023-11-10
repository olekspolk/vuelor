<template>
  <ColorPickerRange
    :min="0"
    :max="1"
    :color="alphaColor"
    :background="alphaBackground"
    :value="value.alpha"
    @input="handleUpdate"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';

import { Color } from './types'
import { RGBAtoCSS, alphaToHex } from './utils'
import ColorPickerRange from './ColorPickerRange.vue'

@Component({
  components: {
    ColorPickerRange
  }
})
export default class ColorPickerAlpha extends Vue {
  @Prop() readonly value!: Color

  get alphaColor (): string {
    return RGBAtoCSS(this.value.rgba)
  }

  get alphaBackground (): string[] {
    return [
      RGBAtoCSS({ ...this.value.rgba, a: 0 }),
      RGBAtoCSS({ ...this.value.rgba, a: 1 })
    ]
  }

  @Emit('input')
  handleUpdate (a: number): Color {
    const hexAlpha = alphaToHex(a)
    return {
      ...this.value,
      alpha: a,
      hexa: `${this.value.hex}${hexAlpha}`,
      hsla: { ...this.value.hsla, a },
      hsva: { ...this.value.hsva, a },
      rgba: { ...this.value.rgba, a }
    }
  }
}
</script>
