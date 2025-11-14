# API Reference

## Components

| Name                              |
| ----------------------------------|
| `ColorPickerRoot.vue`             |
| `ColorPickerCanvas.vue`           |
| `ColorPickerEyeDropper.vue`       |
| `ColorPickerInputHSB.vue`         |
| `ColorPickerInputHSL.vue`         |
| `ColorPickerInputRGB.vue`         |
| `ColorPickerSliderAlpha.vue`      |
| `ColorPickerSliderRed.vue`        |
| `ColorPickerSliderGreen.vue`      |
| `ColorPickerSliderBlue.vue`       |
| `ColorPickerSliderHue.vue`        |
| `ColorPickerSliderSaturation.vue` |
| `ColorPickerSliderLightness.vue`  |


## ColorPickerRoot.vue

| Props        | Default        | Description                                                    |
| ------------ | -------------- | -------------------------------------------------------------- |
| modelValue   | `-`            | `null \| string \| ColorObject`                                |
| defaultValue | `#B63DDAFF`    | `string` default color                                         |
| format       | `hexa`         | `hex \| hexa \| hsl \| hsla \| hsv \| hsva \| object`          |
| styling      | `tailwindcss`  | `tailwindcss \| vanillacss`                                    |
| disabled     | `-`            | `boolean`                                                      |
| class        | `-`            | `string`                                                       |
| ui           | `-`            | `ThemeSlots`                                                   |

### ColorObject

```ts
type ColorObject = {
  rgb: RGB
  rgba: RGBA
  hsl: HSL
  hsla: HSLA
  hsv: HSV
  hsva: HSVA
  hex: Hex
  hexa: Hexa
}
```

### ThemeSlots

```ts
type ThemeSlots {
  picker: {
    root: string
  },
  dropper: {
    base: string
  },
  shared: {
    thumb: string
  },
  canvas: {
    root: string
    area: string
  },
  slider: {
    root: string
    track: string
  },
  input: {
    group: string
    item: string
    label: string
    field: string
  }
}
```

## ColorPickerCanvas.vue

| Props        | Default        | Description       |
| ------------ | -------------- | ----------------- |
| type         | `HSV`          | `HSV \| HSL`      |
| height       | `208`          | `number`          |
| width        | `208`          | `number`          |
| wheel        | `true`         | `boolean`         |
| class        | `-`            | `string`          |
| ui           | `-`            | Canvas UI Slots   |


## ColorPickerSlider*.vue

| Props        | Default        | Description              |
| ------------ | -------------- | ------------------------ |
| orientation  | `horizontal`   | `horizontal \| vertical` |
| class        | `-`            | `string`                 |
| ui           | `-`            | Slider UI Slots          |

## ColorPickerSliderHue.vue

| Props        | Default        | Description              |
| ------------ | -------------- | ------------------------ |
| inverted     | `false`        | `boolean`                |
| orientation  | `horizontal`   | `horizontal \| vertical` |
| class        | `-`            | `string`                 |
| ui           | `-`            | Slider UI Slots          |


## ColorPickerInput*.vue

| Props        | Default        | Description              |
| ------------ | -------------- | ------------------------ |
| class        | `-`            | `string`                 |
| ui           | `-`            | Slider UI Slots          |
