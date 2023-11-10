<template>
  <ColorPickerRange
    :min="0"
    :max="360"
    :color="hueColor"
    :background="hueBackground"
    :value="value.hue"
    @input="handleUpdate"
  />
</template>

<script lang="ts">
import { Prop, Emit, Component, Vue } from 'vue-property-decorator';
import { Color } from './types'
import { fromHSVA } from './utils'
import ColorPickerRange from './ColorPickerRange.vue'

@Component({
  components: { ColorPickerRange }
})
export default class ColorPickerHue extends Vue {
  @Prop() readonly value!: Color

  get hueColor (): string {
    return `hsl(${this.value.hue},100%,50%)`
  }

  readonly hueBackground: string[] = [
    '#FF0000',
    '#FFFF00',
    '#00FF00',
    '#00FFFF',
    '#0000FF',
    '#FF00FF',
    '#FF0000'
  ]

  @Emit('input')
  handleUpdate (h: number) {
    return fromHSVA({ ...this.value.hsva, h })
  }
}
</script>
