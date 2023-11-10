<template>
  <div
    class="wrapper"
    :style="{ background: color }"
  >
    <ColorPickerInput
      class="mb-5"
      :value="{ hexa: color }"
    />
    <ColorPicker
      :show-header="true"
      :show-swatches="true"
      :swatches="swatches"
      v-model="color"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ColorPicker from './components/ColorPicker.vue'
import ColorPickerInput from './components/ColorPickerInput.vue'

@Component({
  components: {
    ColorPicker,
    ColorPickerInput
  }
})
export default class App extends Vue {
  color: string = '#ff00ffff'

  swatches: string[] = [
    '#8E5AF1FF',
    '#ff0f7bFF',
    '#f89b29FF',
    '#c9def4FF',
    '#f5ccd4FF',
    '#b8a4c9FF',
    'linear-gradient(180deg, rgba(142, 90, 241, 1) 0%, rgba(255, 0, 255, 1) 40%, rgba(248, 155, 41, 1) 100%)',
    'linear-gradient(135deg, rgba(255, 0, 255, 1) 0%, rgba(248, 155, 41, 1) 100%)',
    'linear-gradient(43deg, rgba(142, 90, 241, 1) 0%, rgba(5, 252, 124, 1) 100%)'
  ]
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  border: none;
  box-sizing: border-box;
}
input {
  font-family: "Inter";
  font-weight: 400;
}
.wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.mb-5 {
  margin-bottom: 14px;
}
</style>
