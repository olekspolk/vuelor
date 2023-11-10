<template>
  <div
    v-if="items.length"
    class="swatches-list"
  >
    <div
      v-for="(item, index) in items"
      class="swatch"
      :key="index"
      :class="{ 'swatch--empty': item === null }"
      :style="{ background: item }"
      @click="$emit('input', item)"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ColorPickerRange extends Vue {
  @Prop() readonly items!: string[]
}
</script>

<style lang="scss" scoped>
.swatches-list {
  padding: 12px;
  padding-top: 8px;
  display: flex;
  flex-wrap: wrap;
  border-top: 1px solid #e6e6e6;
}
.swatch {
  cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACuUlEQVRYR+2Wv2tTURTHPzWtMSGJkXJjheCzSwqlBbf+AwXBVbGr4N4OxUHqILgEBZducXB36eBkoijiokNx6WChKkkaRYk/kmdj4k++8lIejyTvpQl0yYPLDby8+/2e7/mec+4Yh/yMHTI+IwIjBUYKjBQYhgJHgBCg/Q/w29kD9bhBCOjbcSAK3AIuAfeBq0AD+BmEwUEJ6LujQBwoAcdcYHXgNGADv/xIHIRAG/w4UAYmOoBcAB4C34dNIAi4MG8Cd4BvwN9eJIIoIINpnQEqjuy70HOQnQWKDgEZs+vjR0Dvw0AOuAicA575yLoKPADeOykYSAGVVgw4ATwH0j7g14CCY8yvQGtQD4hAEjhljHlVq9XGm81mtzPXgEeA0vMZ+OGXfx3UKwVtwxljzFvLssYLhQILCwtsb297SQj8sQe8Z+7bB3QjsO92Y0zZsqwJgSeTEgNmZmb2ScTj8bv1ev2eU5JVJ/JA4N0U6Amuj5aXl1lfXycSibQajcYV4AXwwTFdYPBuBNThkp0ib4PncjkmJyezlUrlsmPSDKDofU3nzZ03Bar3RCaTeZ1IJIxbdje4MeZGuVx+CdQAC8g7NR+o/7tJeAlEgFQsFnu3sbHB4uLi/n8luyJPpVJrpVLpqeP0PSfn2jWANAn7etwEVHLH5+bmVm3bXstmsywtLf0/zAOuUlOTUfSKWI1GQ0erZ9PpxMxNQEPFhMPh3XQ6TbVaZWVlhc3NTfL5fDtygasdt+u8L8P5EZD8U6FQ6M309DQ7OzvMzs62Wq3WXrPZzBaLxSfDBvdWgQicnJ+fv23b9vloNFrZ2tq6DnwBPgKfnN/qcANH3qkRqfzU86fkBadL6nKhkaql2a4+PDRwrwIyoW42Gj6agDKUnK2IBSyH920yv5LwlqFI6J7nvmD2XVp+oO73/wCYDd0hLRJBDQAAAABJRU5ErkJggg==) 4 26,auto;
  height: 16px;
  width: 16px;
  margin: 4px;
  border-radius: 1px;

  &--empty {
    position: relative;
    box-shadow: none;
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
</style>
