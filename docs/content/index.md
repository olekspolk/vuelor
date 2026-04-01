---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Vuelor"
  text: "The composable color picker for Vue 3"
  tagline: Build exactly the picker your design needs — no overrides, no fighting the defaults.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: View examples
      link: /examples

features:
  - icon: 🧩
    title: Composable building blocks
    details: Instead of one rigid <ColorPicker /> drop-in, you get focused primitives — Canvas, Sliders, Inputs, Swatches — that you compose yourself. Use only what you need.
    link: /guide/getting-started
    linkText: Get started
  - icon: 🎨
    title: Tailwind-native, CSS-optional
    details: Every slot ships with Tailwind classes out of the box. Prefer plain CSS? Switch to vanillacss mode. Want full control? Use unstyled mode and bring your own classes entirely.
    link: /guide/customization
    linkText: Customization guide
  - icon: ⌨️
    title: Accessible out of the box
    details: Keyboard navigation, ARIA attributes, and focus management are built in from the start — following the WAI-ARIA Color Picker pattern so you don’t have to think about it.
    link: /guide/api-reference
    linkText: API reference
  - icon: 🔢
    title: Flexible output formats
    details: Emit color as hexa, rgb, hsl, hsv, or a plain object with all representations at once. Alpha channel is included automatically when your chosen format supports it.
    link: /guide/api-reference#format
    linkText: Format table
---
