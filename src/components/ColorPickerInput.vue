<template>
  <div class="color-input">
    <div
      :style="styles"
      :class="{
        'color-input__swatch--empty': color === null
      }"
      class="color-input__swatch"
      @click="$emit('select')"
    />
    <input
      type="text"
      class="color-input__field"
      :disabled="isInputDisabled"
      :value="hexColor"
      @blur="handleColorType">
    <input
      type="text"
      class="color-input__field"
      :disabled="isInputDisabled"
      :value="alphaPercent"
      @blur="handleAlphaType">
  </div>
</template>

<script lang="ts">
import { CSSProperties } from 'vue/types/jsx';
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { Hexa, Color } from './types'
import { normalizeHex, fromHexa } from './utils'

@Component
export default class ColorPickerInput extends Vue {
  @Prop() readonly value!: Color

  get color (): Hexa {
    return this.value?.hexa
  }

  set color (value: Hexa) {
    this.onInput(fromHexa(value))
  }

  get hexColor (): string {
    if (this.color) {
      if (this.color.includes('linear')) {
        return 'Linear'
      }
      return this.color.substring(1, 7)
    }
    return '-'
  }

  get alphaPercent () {
    if (this.color) {
      if (this.color.includes('linear')) {
        const deg = parseInt(this.color.substring(this.color.indexOf('(') + 1, this.color.indexOf(',') - 3))
        return `${deg}°`
      }
      const alpha = parseInt(this.color.substring(7, 9), 16)
      return `${Math.round(alpha / 255 * 100)}%`
    }
    return '-'
  }

  get luminosity () {
    return 0.5
  }

  get styles (): CSSProperties {
    return {
      background: this.color || 'inherit',
      boxShadow: this.luminosity > 0.8
        ? 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px inset'
        : 'none'
    }
  }

  get isInputDisabled () {
    return this.color.includes('linear')
  }

  handleColorType (event: FocusEvent) {
    const { value } = event.target as HTMLInputElement
    this.color = normalizeHex(value)
  }

  handleAlphaType (event: FocusEvent) {
    const { value } = event.target as HTMLInputElement
    const percent = parseInt(value.replace('%', ''))
    const alpha = Math.round(255 * percent / 100).toString(16)
    this.color = `${this.color?.substring(0, 7)}${alpha}`
  }

  @Emit('input')
  onInput (value: Color) {
    return value
  }
}
</script>

<style lang="scss" scoped>
.color-input {
  height: 28px;
  display: flex;
  align-items: center;
  border: none;
  border: 1px solid transparent;
  background-color: #fff;

  input,
  button {
    border: none;
    background: transparent;
  }

  &:hover {
    border: 1px solid rgba(0, 0, 0, .1);
  }

  &:focus-within {
    border: 1px solid var(--color-primary, rgba(0, 0, 0, .1));
    outline: 1px solid var(--color-primary, rgba(0, 0, 0, .1));
    outline-offset: -2px;
  }

  &__swatch {
    margin: 8px 0 8px 5px;
    flex-grow: 1;
    flex-shrink: 0;
    height: 16px;
    width: 16px;
    border-radius: 1px;

    &--empty {
      position: relative;
      border: 1px solid rgba(0, 0, 0, .1);

      &::after {
        content: "";
        position: absolute;
        top: 46%;
        left: -21%;
        height: 1px;
        width: 145%;
        background-color: red;
        transform: rotate(-45deg);
      }
    }
  }

  &__field {
    cursor: default;
    color: #333;
    padding: 0 0 0 7px;
    height: 28px;
    width: 100%;
    font-size: 11px;
    text-transform: uppercase;

    &:disabled {
      text-transform: none;
    }

    &:last-child {
      width: 44px;
      padding-left: 7px;
      border-left: 1px solid transparent;
    }

    &:focus {
      outline: none;
    }
  }

  &:hover &__field:last-child {
    border-left: 1px solid rgba(0, 0, 0, .1);
  }
}
</style>
